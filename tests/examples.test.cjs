const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { mkdirSync } = require('node:fs');
let browser;
test.before(async () => { browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] }); });
test.after(async () => { await browser?.close(); });
const url = name => pathToFileURL(resolve(__dirname, '../examples', `${name}.html`)).href;

test('cone area follows the square of slice height while camera rotation preserves the answer',async()=>{
  const page=await browser.newPage();await page.goto(url('geometry-slices'));
  await page.locator('#trial-a').click();assert.equal(await page.locator('#radius').textContent(),'1.00 cm');
  await page.locator('#trial-b').click();assert.equal(await page.locator('#radius').textContent(),'2.00 cm');
  assert.equal(await page.locator('#area').textContent(),'12.57 cm²');
  const before=await page.locator('#mesh').innerHTML();
  await page.locator('#yaw').focus();await page.keyboard.press('End');
  assert.notEqual(await page.locator('#mesh').innerHTML(),before);assert.equal(await page.locator('#area').textContent(),'12.57 cm²');
  await page.locator('input[name="transfer"][value="9"]').check();await page.locator('#transfer-check').click();
  assert.match(await page.locator('#transfer-feedback').textContent(),/^Yes/);
  await page.locator('#reset').click();assert.equal(await page.locator('#height').inputValue(),'2');
  await page.locator('#height').focus();await page.keyboard.press('Home');assert.equal(await page.locator('#area').textContent(),'0.00 cm²');
  await page.keyboard.press('End');assert.equal(await page.locator('#area').textContent(),'50.27 cm²');
  await page.locator('#pitch').focus();await page.keyboard.press('End');
  await page.locator('#stage').scrollIntoViewIfNeeded();
  const visibleCap=await page.locator('#stage').evaluate(svg=>{
    const matrix=svg.getScreenCTM();
    return [[260,285],[280,300],[300,285]].map(([x,y])=>{
      const point=new DOMPoint(x,y).matrixTransform(matrix);
      return document.elementFromPoint(point.x,point.y)?.getAttribute('fill');
    });
  });
  assert.deepEqual(visibleCap,['#e9ae46','#e9ae46','#e9ae46'],'the visible endpoint cap must remain gold');
  await page.close();
});

test('anatomy cutaway and rotation change visibility without changing organ relationships',async()=>{
  const page=await browser.newPage();await page.goto(url('human-anatomy'));
  const centers=await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(lesson.structures).map(([k,v])=>[k,v.center]))));
  const image=()=>page.locator('#stage').evaluate(canvas=>canvas.toDataURL());
  const closed=await image();await page.locator('#cutaway').check();
  const opened=await image();assert.notEqual(opened,closed,'opening the chest must change visible atlas surfaces');
  await page.locator('#side').click();assert.equal(await page.locator('#yaw').inputValue(),'90');
  assert.notEqual(await image(),opened,'the side view must reproject the real mesh');
  await page.locator('#organ').selectOption('diaphragm');assert.match(await page.locator('#selection').textContent(),/Diaphragm/);
  const withLungs=await image();await page.locator('#lungs').uncheck();assert.notEqual(await image(),withLungs);
  assert.equal(await page.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries(lesson.structures).map(([k,v])=>[k,v.center])))),centers);
  await page.locator('#reset').click();assert.equal(await page.locator('#cutaway').isChecked(),false);assert.equal(await page.locator('#lungs').isChecked(),true);
  assert.equal(await page.locator('#yaw').inputValue(),'0');await page.close();
});

test('anatomy retains a readable explanation and controls without WebGL',async()=>{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:original.call(this,type,...args);};});
  await page.goto(url('human-anatomy'));
  assert.equal(await page.locator('#render-fallback').isVisible(),true);
  assert.equal(await page.locator('#cutaway').isDisabled(),true);
  await page.locator('#organ').selectOption('heart');
  assert.match(await page.locator('#selection').textContent(),/Heart/);
  await page.locator('#reset').click();assert.equal(await page.locator('#cutaway').isChecked(),false);
  assert.deepEqual(errors,[]);await page.close();
});

test('transformer mask changes actual attention and the final query retains all allowed tokens',async()=>{
  const page=await browser.newPage();await page.goto(url('transformer-flow'));
  const masked=await page.evaluate(()=>model(1,true));
  assert.equal(masked.weights[2],0);assert.ok(Math.abs(masked.weights[0]-.3444632017684351)<1e-12);
  await page.locator('#causal').uncheck();
  const open=await page.evaluate(()=>model(1,false));assert.ok(open.weights[2]>.3);
  assert.notDeepEqual(open.mixed,masked.mixed);
  await page.locator('#causal').check();
  await page.locator('input[name="prediction"][value="yes"]').check();
  await page.getByRole('button',{name:'Save prediction'}).click();
  assert.match(await page.locator('#feedback').textContent(),/challenge your prediction/);
  await page.locator('[data-stage="6"]').click();assert.match(await page.locator('#stage-values').textContent(),/Block output/);
  await page.locator('[data-query="2"]').click();await page.locator('#causal').check();
  const last=await page.evaluate(()=>model(2,true).weights);assert.ok(last.every(w=>w>0));
  await page.locator('#writing').fill('A causal mask removes future scores before softmax.');
  await page.locator('#reset').click();assert.equal(await page.locator('#causal').isChecked(),true);
  assert.equal(await page.locator('#writing').inputValue(),'');await page.close();
});

test('clothing inspection reveals the inner panel and preserves the stated robe structure',async()=>{
  const page=await browser.newPage();await page.goto(url('chinese-clothing'));
  assert.equal(await page.locator('#fold-inspect').isChecked(),true);
  await page.locator('#fold-inspect').uncheck();assert.equal(await page.locator('#fold-detail').isVisible(),false);
  assert.equal(await page.locator('#fold-caption').isVisible(),false);
  await page.locator('#fold-inspect').check();assert.equal(await page.locator('#fold-detail').isVisible(),true);
  assert.ok(await page.locator('#fold-caption').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=14));
  await page.locator('#open').check();assert.equal(await page.locator('#outer').getAttribute('transform'),'translate(88 -12)');
  await page.locator('#open').uncheck();
  await page.locator('input[name="prediction"][value="skin"]').check();
  await page.getByRole('button',{name:'记下预测'}).click();
  assert.match(await page.locator('#feedback').textContent(),/^你的预测是没有另一片衣襟/);
  await page.locator('#open').check();
  await page.locator('#explode').focus();await page.keyboard.press('End');
  assert.equal(await page.locator('#lower').getAttribute('transform'),'translate(0 35)');
  assert.equal(await page.locator('#upper').getAttribute('transform'),'translate(0 -13)');
  assert.equal(await page.locator('#fold-point').getAttribute('cy'),'460');
  await page.locator('input[name="transfer"][value="wrong"]').check();await page.getByRole('button',{name:'核对答案'}).click();
  assert.match(await page.locator('#transfer-feedback').textContent(),/正确|对/);
  await page.locator('#writing').fill('The gap is an inspection view of one robe.');await page.locator('#reset').click();
  assert.equal(await page.locator('#open').isChecked(),false);assert.equal(await page.locator('#explode').inputValue(),'0');
  assert.equal(await page.locator('#writing').inputValue(),'');
  assert.equal(await page.locator('#fold-inspect').isChecked(),true);
  assert.equal(await page.locator('#fold-point').getAttribute('cy'),'425');await page.close();
});

test('rocket model handles pad support, delayed liftoff, burnout, and coasting', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url('rocket-launch'));
  const samples = await page.evaluate(() => [flight(1,40,0),flight(1,80,0),flight(1,55,0),flight(50,55,0),flight(50,80,0),flight(51,80,0)]);
  assert.equal(samples[0].height,0);
  assert.ok(samples[1].height>0);
  assert.equal(samples[2].height,0);
  assert.ok(samples[3].height>0);
  assert.equal(samples[4].thrust,0);
  assert.ok(samples[5].height>samples[4].height&&samples[5].velocity>0);
  const reference = await page.evaluate(() => {
    const comparisons = [];
    for (const throttle of [40,55,80,100]) {
      const thrust=18000*throttle/100, flow=thrust/1800, dt=.001;
      let height=0,velocity=0,mass=1200;
      for(let step=0;step<50000;step++){
        const burning=mass>800+1e-8;
        const acceleration=(burning?thrust:0)/mass-9.81;
        velocity+=acceleration*dt;
        height+=velocity*dt;
        if(height<0){height=0;velocity=0;}
        if(burning)mass=Math.max(800,mass-flow*dt);
      }
      comparisons.push({height,velocity,exact:flight(50,throttle,0)});
    }
    return comparisons;
  });
  for(const sample of reference){assert.ok(Math.abs(sample.height-sample.exact.height)<1);assert.ok(Math.abs(sample.velocity-sample.exact.velocity)<.05);}
  assert.equal(await page.locator('#run').isDisabled(),true);
  await page.locator('#step').click();
  assert.match(await page.locator('#time-value').textContent(),/1\.0 s/);
  await page.locator('#reveal').click();
  await page.locator('#explain').fill('Thrust must exceed weight for immediate lift.');
  await page.locator('input[name="transfer"][value="coast"]').check();
  await page.getByRole('button',{name:'检查新预测'}).click();
  assert.match(await page.locator('#transfer-feedback').textContent(),/^正确/);
  await page.locator('#reset').click();
  assert.equal(await page.locator('#explanation').isVisible(),false);
  assert.equal(await page.locator('#explain').inputValue(),'');
  assert.deepEqual(errors,[]);
  await page.close();
});

test('rocket cutaway and component inspection preserve the flight model',async()=>{
  const page=await browser.newPage({reducedMotion:'reduce'});await page.goto(url('rocket-launch'));
  await page.locator('#step').click();const before=await page.locator('.readouts').innerText();
  await page.locator('input[name="inspection"][value="cutaway"]').check();
  assert.equal(await page.locator('#technical').getAttribute('data-view'),'cutaway');
  await page.locator('input[name="inspection"][value="exploded"]').check();
  assert.equal(await page.locator('#technical').getAttribute('data-view'),'exploded');
  await page.locator('#inspect-component').selectOption('nozzle');
  assert.match(await page.locator('#inspection-description').textContent(),/喉部/);
  assert.equal(await page.locator('.readouts').innerText(),before,'inspection cannot change flight results');
  await page.locator('#reset').click();assert.equal(await page.locator('#time').inputValue(),'0');
  await page.close();
});

for(const name of ['geometry-slices','human-anatomy','rocket-launch','transformer-flow','chinese-clothing']){
  test(`${name} works offline at desktop/mobile widths in both themes`,async()=>{
    mkdirSync(resolve(__dirname,'../test-results'),{recursive:true});
    for(const width of [360,1000])for(const colorScheme of ['light','dark']){
      const page=await browser.newPage({viewport:{width,height:1000},colorScheme,reducedMotion:'reduce'});
      const errors=[],remote=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});
      await page.goto(url(name));
      assert.ok(await page.getByRole('heading',{level:1}).count());
      assert.ok(await page.getByRole('button').count()>=2);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page must fit the viewport');
      assert.deepEqual(errors,[]);
      assert.deepEqual(remote,[],'page must not fetch remote assets');
      await page.screenshot({path:resolve(__dirname,`../test-results/${name}-${width}-${colorScheme}.png`),fullPage:true});
      await page.close();
    }
  });
}

test('example directory links to six local complete lessons',async()=>{
  const page=await browser.newPage({viewport:{width:360,height:900}});
  await page.goto(url('index'));
  const links=await page.locator('article a').evaluateAll(items=>items.map(a=>a.href));
  assert.equal(links.length,6);
  for(const link of links){await page.goto(link);assert.ok(await page.getByRole('heading',{level:1}).count());}
  await page.close();
});
