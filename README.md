# Jacob's website

This website uses the minimalist Jekyll theme, Millennial specifically for publication
on [Github Pages](https://pages.github.com/). All the information about the Millennial
theme can be found on [this demo site](https://lenpaul.github.io/Millennial/).

Millennial is a Jekyll theme that was built to be 100% compatible with [GitHub Pages](https://pages.github.com/). If you are unfamiliar with GitHub Pages, you can check out [their documentation](https://help.github.com/categories/github-pages-basics/) for more information. [Jonathan McGlone's guide](http://jmcglone.com/guides/github-pages/) on creating and hosting a personal site on GitHub is also a good resource.

## Making updates
To add a project to the website:
1. add a markdown file to the `_posts` directory following the naming convention of the other posts,
1. add an image to the `assets\img` folder,
1. push changes to GitHub.

To build the website locally, execute the build script.

```build.sh```

If you get a `zsh: permission denied` error message, you need to modify the permissions for the shell script.

```sudo chmod +x build.sh```

## Helpful links
* [Jekyll](https://jekyllrb.com/)
* [GitHub Pages](https://pages.github.com/)git
* Getting Jekyll to work on an Apple M1 was a pain. [Jekyll on macOS Apple M1 [Solved] by Shouvik Basak](https://www.shouvikbasak.net/website/jekyll-on-macos-apple-m1-solved/) was the biggest help.
* [Configuring a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## License

Open sourced under the [MIT license](https://github.com/LeNPaul/Millennial/blob/gh-pages/LICENSE.md).
