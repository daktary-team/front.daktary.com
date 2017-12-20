/**
 * Functions dedicate to expose template html
 *
 */

const tpl = {}

/**
* Get tree template for a specific item.
*
* @return {Object} DOM partial DOM represents item.
*/
tpl.getTreeTags = () => {
  const tpl = document.querySelector('template#tplTree').cloneNode(true).content
  const container = () => {
    const container = tpl.querySelector('[data-title=tree]').cloneNode(true)
    container.innerHTML = ''
    return container
  }
  return {
    containerTpl: container(),
    dir: {
      containerTpl: tpl.querySelector('[data-title=dir]'),
      linkTpl: tpl.querySelector('[data-title=folderLink]'),
      githubLinkTpl: tpl.querySelector('[data-title=folderGithubLink]')
    },
    repo: {
      containerTpl: tpl.querySelector('[data-title=repo]'),
      linkTpl: tpl.querySelector('[data-title=repoLink]'),
      githubLinkTpl: tpl.querySelector('[data-title=repoGithubLink]')
    },
    file: {
      containerTpl: tpl.querySelector('[data-title=file]'),
      titleTpl: tpl.querySelector('[data-title=folderTitle]'),
      linkTpl: tpl.querySelector('[data-title=fileLink]'),
      excerptTpl: tpl.querySelector('[data-title=fileExcerpt]'),
      readmoreLinkTpl: tpl.querySelector('[data-title=fileReadmoreLink]')
    }
  }
}

/**
* Get file template.
*
* @return {Object} DOM partial DOM represents file.
*/
tpl.getFileTags = () => {
  const tpl = document.querySelector('template#tplFile').cloneNode(true).content
  return {
    containerTpl: tpl,
    contentTpl: tpl.querySelector('[data-title=content]'),
    githubLinkTpl: tpl.querySelector('[data-title=githubLink]')
  }
}

/**
* Get breadcrumb template.
*
* @return {Object} elements collection represents breadcrumb.
*/
tpl.getBreadCrumbTags = () => {
  const tpl = document.querySelector('template#tplBreadcrumb').cloneNode(true).content
  return {
    containerTpl: tpl.querySelector('[data-title=container]'),
    itemTpl: tpl.querySelector('[data-title=item]'),
    linkTpl: tpl.querySelector('[data-title=link]')
  }
}
