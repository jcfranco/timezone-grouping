# 0.2.0

- fix: fix package entry points (873d8b3)
- chore: add .npmrc (5386668)
- chore: configure release-it to update changelog (6828c5c)
- docs: add changelog (f904cbc)
- feat: make specifying engine optional for both Node and browser contexts (0b18b48)
- feat: generate types (8217f02)
- chore: clean up package contents (9c9882c)

# 0.1.0

- fix: fix package.json bin entry
- fix: ensure label groups are generated equally
- feat: simplify group interface
- feat: transform label into an array of time zone labels by index
- fix: fix output filename generation
- feat: generate labels that are equally distributed
- feat: add hooks to customize output
- feat: allow passing custom DateEngine
- fix: fix native adapter
- feat: add debug mode to check generated timezones
- feat: add support for CLI options
- perf: cache processed date-timezones
- feat: add support to swap date libs
- perf: improve mapped db computation
- feat: use current date as start date when creating groups
- feat: change default interval to boost performance and minimal group change
