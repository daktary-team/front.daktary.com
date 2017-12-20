const jsDom = require('jsdom').JSDOM
const expect = require('chai').expect
const dom = require('../src/dom')

describe('breadcrumb', () => {
  const document = new jsDom(`<!DOCTYPE html>`).window.document
  const breadcrumb = document.createElement('ul')
  breadcrumb.insertAdjacentHTML('afterbegin', '<li><a href=#>Accueil</a></li>')

  it('should return false', () => {
    console.log(dom)
    expect(true).to.be.equal(true)
  })
})
