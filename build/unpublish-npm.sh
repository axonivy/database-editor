#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/database-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/database-editor-protocol@${1}" --registry $REGISTRY
