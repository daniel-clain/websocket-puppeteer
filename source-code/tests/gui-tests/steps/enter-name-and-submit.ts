import {Page} from 'puppeteer';
const enterNameAndSubmit = async (page: Page, name = 'Daniel') => {  
  console.log(name);
  console.log('page :', !!page);
  await page.focus('#name-input')
  await page.keyboard.type(name)
  await page.click('#submit-name-button')
}

export default enterNameAndSubmit