#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/database-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/database-editor-protocol@${1}" --registry $REGISTRY
