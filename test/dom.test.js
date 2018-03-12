const jsDom = require('jsdom').JSDOM
const expect = require('chai').expect

const Dom = require('../src/dom').Dom

const document = new jsDom(`<!DOCTYPE html>`).window.document

describe('breadcrumb', () => {
  const breadcrumbTpl = document.createElement('ul')
  breadcrumbTpl.insertAdjacentHTML('afterbegin', '<li><a href=#>Accueil</a></li>')
  const tpl = {
    containerTpl: breadcrumbTpl,
    itemTpl: breadcrumbTpl.querySelector('li'),
    linkTpl: breadcrumbTpl.querySelector('a')
  }

  it('should return Accueil when no-data', () => {
    expect(Dom._createBreadcrumb(tpl, [])).to.be.an('HTMLUListElement')
    expect(Dom._createBreadcrumb(tpl, []).querySelector('a').innerHTML).to.be.equal('Accueil')
  })
})
