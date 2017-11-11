/* global route */

/**
 * Functions dedicate to DOM interaction
 *
 */

const dom = {}

/**
* get anchor in html
*
* @return {Object} node anchor.
*/
dom.getAnchor = hash => document.querySelector(`a[name="${hash}"]`)

/**
 * Private functions
 */

/**
* Inject Github document in html
*
* @param {Object} page a json document from daktary API.
*/
dom._injectBlobInHtml = page => {
  const tpl = document.querySelector('template#tplBlob').content

  dom._renderBreadcrumb(page.breadcrumb)

  tpl.querySelector('.blobGhLink').href = `https://github.com/${dom._ghPath()}`
  tpl.querySelector('.blobContent').innerHTML = page.body
  dom._injectTpl(tpl)
}

/**
* Inject Github tree in html
*
* @param {Object} page a json tree from daktary API.
*/
dom._injectTreeInHtml = page => {
  const tree = document.querySelector('template#tplTree').cloneNode(true).content
  const section = tree.querySelector('section.ghTree')
  section.innerHTML = ''

  dom._renderBreadcrumb(page.breadcrumb)

  page.body.forEach(item => {
    switch (item.type) {
      case 'file':
        const file = tree.querySelector('.ghTypeFile').cloneNode(true)
        file.querySelector('h2 a.fileLink').innerText = item.meta ? item.meta.title : item.name
        file.querySelector('h2 a.fileLink').href = `#${item.full_name}`
        file.querySelector('p.ghTreeExcerpt').innerText = item.meta ? item.meta.description : ''
        file.querySelector('a.ghTreeReadmore').title += item.meta ? item.meta.title : item.name
        file.querySelector('a.ghTreeReadmore').href = `#${item.full_name}`
        section.appendChild(file)
        break
      case 'dir':
        const folder = tree.querySelector('.ghTypeFolder').cloneNode(true)
        folder.querySelector('h2 a.folderLink').innerText = item.name
        folder.querySelector('h2 a.folderLink').href = `#${item.full_name}`
        folder.querySelector('a.folderGhLink').href = item.html_url
        section.appendChild(folder)
        break
      case 'repo':
        const repo = tree.querySelector('.ghTypeRepo').cloneNode(true)
        repo.querySelector('h2 a.repoLink').innerText = item.name
        repo.querySelector('h2 a.repoLink').href = `#${item.full_name}`
        repo.querySelector('a.repoGhLink').href = item.html_url
        section.appendChild(repo)
    }
    dom._injectTpl()
  })
}

/**
* Build a breadcrumb with path
*
* @param {String} type a github type like: repo, tree or files.
* @param {String} path a github path.
*/
dom._renderBreadcrumb = bdr => {
  const breadcrumbData = [
    { link: 'pointbar', title: 'pointbar' },
    { link: 'pointbar/funkyrh/master', title: 'funkyrh' },
    { link: 'pointbar/funkyrh/tree/master/machin', title: 'machin' },
    { link: 'pointbar/funkyrh/tree/master/machin/truc', title: 'truc' },
  ]

  const getLi = (ul, {link, title}) => {
    const li = ul.querySelector('li').cloneNode(true)
    const a = li.querySelector('a')
    a.href = `#${link}`
    a.innerText = title
    return li
  }

  const breadcrumb = document.querySelector('template#tplBreadcrumb').cloneNode(true).content
  const ul = breadcrumb.querySelector('ul')
  const div = document.querySelector('div.breadcrumb')
  breadcrumbData.forEach(elt => ul.appendChild(getLi(ul, elt)))
  div.innerHTML = ''
  div.appendChild(ul)
}

/**
* Replace the html main.container's childrens by a template content
*
* @param {Object} templateContent a template content.
*/
dom._injectTpl = tpl => {
  const container = document.querySelector('main.container')
  container.innerHTML = ''
  container.appendChild(document.importNode(tpl, true))
}

/**
* get ghPath with route.js
*
* @return {Object} node anchor.
*/
dom._ghPath = () =>
  route.getHash()
