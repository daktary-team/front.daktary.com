const jsDom = require('jsdom').JSDOM
const expect = require('chai').expect

const Dom = require('../src/dom').Dom

const document = new jsDom(`<!DOCTYPE html>`).window.document

describe('hash', () => {
  const anchorTpl = document.createElement('div')
  anchorTpl.insertAdjacentHTML('afterbegin', '<a name=recipes></a>')
  it('should get anchor by name in document', () => {
    expect(Dom.getAnchor(anchorTpl, 'recipes')).to.be.an('HTMLAnchorElement')
    expect(Dom.getAnchor(anchorTpl, 'sepicer')).to.be.null
  })
})

describe('render', () => {
  it('should get the renderer method name', () => {
    expect(Dom._getRenderer('repo')).to.be.equal('_renderRepo')
  })
  it('should get the tree\'s creater method name', () => {
    expect(Dom._getCreaterTree('repo')).to.be.equal('_createTreeRepo')
  })
})


describe('breadcrumb', () => {
  const breadcrumbTpl = document.createElement('ul')
  breadcrumbTpl.insertAdjacentHTML('afterbegin', '<li><a href=#>Accueil</a></li>')
  function tpl () {
    const tpl = {containerTpl: breadcrumbTpl.cloneNode(true)}
    tpl.itemTpl = tpl.containerTpl.querySelector('li')
    tpl.linkTpl = tpl.containerTpl.querySelector('a')
    return tpl
  }

  it('should return Accueil when no-data', () => {
    expect(Dom._createBreadcrumb(tpl(), [])).to.be.an('HTMLUListElement')
    expect(Dom._createBreadcrumb(tpl(), []).querySelector('a').text).to.be.equal('Accueil')
  })
  it('should return repo', () => {
    expect(Dom._createBreadcrumb(tpl(), [{title: 'pointbar', link: 'pointbar'}])
      .querySelectorAll('a')[1].text).to.be.equal('pointbar')
    expect(Dom._createBreadcrumb(tpl(), [{title: 'pointbar', link: 'pointbar'}])
      .querySelectorAll('a')[1].href).to.match(/#pointbar$/)
  })
  it('should return breadcrumb with tree', () => {
    const data = [{title: 'pointbar', link: 'pointbar'}, {title: 'daktary',link: 'pointbar/daktary'}]
    expect(Dom._createBreadcrumb(tpl(), data).querySelectorAll('a')).to.have.lengthOf(3)
    expect(Dom._createBreadcrumb(tpl(), data)
      .querySelectorAll('a')[2].text).to.be.equal('daktary')
    expect(Dom._createBreadcrumb(tpl(), data)
      .querySelectorAll('a')[2].href).to.match(/#pointbar\/daktary$/)
  })
})
