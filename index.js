document.addEventListener('DOMContentLoaded', () =>
{
  const url = document.querySelector('ul').getAttribute('data-gh')

  fetch(`http://api.daktary.com/${url}`)
    .then(response => response.json())
    .then(json => {
      json.body.map(file => {
        document.querySelector('ul').innerHTML +=
        `<li> <a href=${file.html_url}>${file.name}</a></li>`
      })
  })

})

// const url = document.querySelector('article').getAttribute('data-gh')

const displayRessource = (url) => {
  fetch(`http://api.daktary.com/${url}`)
    .then(response => response.json())
    .then(json => {
      document.querySelector('body').innerHTML = json.body
  })
}
