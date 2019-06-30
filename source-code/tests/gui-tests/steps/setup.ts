
import * as puppeteer from 'puppeteer'
import { Browser, Page, BrowserContext } from 'puppeteer';

const setup = async (windowLocation, windowDimensions): Promise<{page: any, browser: any}> => {  
  const browser: Browser = await puppeteer.launch({
    headless: false,
    slowMo: 30,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ["--ash-host-window-bounds=1920x1080", `--window-size=${windowDimensions.width},${windowDimensions.height}`, `--window-position=${windowLocation.x},${windowLocation.y}`]
  });  
  let page
  await browser.pages().then(pages => page = pages[0])
  await page.goto('localhost:4444');
  return {page: page, browser: browser}
}

export default setup