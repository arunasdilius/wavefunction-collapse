# @todo
- [ ] ~~Do not create irrelevant cells~~ - not really possible
- [ ] Implement chunking
- [ ] ~~Destroy rendered and irrelevant cells~~ - irrelevant
- [ ] Add noise map for randomizing weights
- [x] Fix floating point precision on scaling (add rounding to output)
- [ ] Deploy to aws s3 and serve via cloudfront
- [ ] Utilise git tools as deployment pipelines
- [ ] Process more waves than fps if computational power allows for that
  - [ ] This should be a setting
  - [ ] Perhaps when fps is "unlimited"
- [ ] Remove weird artifact from loader
- [x] Add option to collapse without border
- [ ] Make compact ui
- [ ] Add html template

# Deployment
```serverless deploy --stage production --region eu-central-1```