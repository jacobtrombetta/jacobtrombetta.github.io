# Jacob Trombetta's website
A personal Jekyll website adapted from Paul Le's [Portfolio Jekyll Theme](https://github.com/LeNPaul/portfolio-jekyll-theme).

## Development
To build and serve the site:
```sh
./scripts/build.sh
```

## Docker
To build and serve the site in Docker instead:
```sh
docker build -t jacobtrombetta-site .
docker run --rm -it -p 4000:4000 -v "$(pwd)":/workspace jacobtrombetta-site
```
Then visit [http://localhost:4000](http://localhost:4000). The `-v` flag mounts the repo into the container so edits on your machine are picked up by Jekyll's live rebuild.

## Credits

### Creator

#### Paul Le

* [www.lenpaul.com](http://lenpaul.com)

* [Twitter](https://twitter.com/paululele)

* [GitHub](https://github.com/LeNPaul)

## License

Open sourced under the [MIT license](https://github.com/LeNPaul/portfolio-jekyll-theme/blob/gh-pages/LICENSE.md).
