# js-interpreter
A Javascript interpreter for MODL, based on TypeScript

## Updating the grammar sources

The following commands will update the content of the `grammar` directory with the new commits done to the antlr4 directory 
of the grammar repository. Please keep them in sync as much as possible to avoid discrepancies.

```
#we create a branch that we will contain the changes and they we will use for a Pull Request
git checkout -b branch-for-pr

#we connect to the grammar repo that contains the files we want
git remote add grammar git@github.com:MODLanguage/grammar
git fetch grammar

#we create a tmp branch with a copy of the grammar on master
git checkout -b removeme-export-branch grammar/master

#we extract the files we're intrested in (we don't want the whole grammar repo)
git subtree split --prefix antlr4 -b removeme-antlr4-branch

#we go back to our main branch for our Pull Request
git checkout branch-for-pr

#we import the file we extracted in the interpreter project
git subtree merge --squash --prefix=grammar/ removeme-antlr4-branch

#we clean up the temporary branches and remote connection
git branch -D removeme-export-branch removeme-antlr4-branch
git remote rm grammar
```


Now we're all set to create a Pull Request on the `branch-for-pr` branch.

Please note that if the version of the files have diverged, the merge conflicts will need to be fixed before proceeding 
to the cleanup. This will only happen if the files were edited manually in the repo without doing a clean import.