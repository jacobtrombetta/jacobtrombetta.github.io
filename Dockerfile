# Use official Ruby image
FROM ruby:3.2

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI
RUN curl -fsSL https://raw.githubusercontent.com/anthropics/claude-code/main/install.sh | sh

# Set working directory
WORKDIR /workspace

# Copy Gemfile and gemspec first for better caching
COPY Gemfile* ./
COPY *.gemspec ./

# Install Ruby gems
RUN bundle install

# Expose Jekyll default port
EXPOSE 4000

# Default command
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
