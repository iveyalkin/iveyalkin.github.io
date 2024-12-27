source "https://rubygems.org"

# For a different Jekyll version, change it below, save the file and run
# $ bundle install
# $ bundle exec jekyll serve

# because gh-pages is used
# gem "jekyll", "~> 3.9"

# Jekyll dependency for Ruby 3.+
gem "webrick", "~> 1.9"

# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.5"

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "github-pages", "~> 232"
  gem "jekyll-brotli"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-coffeescript", "~> 1.2"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
