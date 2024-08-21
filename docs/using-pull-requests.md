# Using Pull Requests for Iris

## Prerequisites

Please watch
[this video by GitHub to learn how to use Pull Requests](https://www.youtube.com/watch?v=nCKdihvneS0).

## Using PRs

We will be using Pull Requests with Iris to keep track of the work we've been
doing into completing a goal.

Here are some example of good PRs:

- <https://github.com/ojosproject/website/pull/45>
- <https://github.com/ojosproject/iris/pull/14>

### Things to keep in PRs

- Any resources you might need to use ([Example](https://github.com/ojosproject/iris/pull/14#issuecomment-2287282721))
- Keeping a record of what you did, and what needs to get done ([Example](https://github.com/ojosproject/iris/pull/14#issuecomment-2287328065))

## How do I start?

Start by thinking of what you want to accomplish by the end of this meeting.
Think of a short branch name and branch off of `main`.

```shell
git branch <YOUR-SHORT-BRANCH-NAME>
git switch <YOUR-SHORT-BRANCH-NAME>
```

Then, start working! As soon as you make a commit, run:

```shell
git push origin <YOUR-SHORT-BRANCH-NAME>
```

... and
[open a PR](https://github.com/ojosproject/iris/compare) from your branch
pointing to `main`.

> [!WARNING]
> Make sure to add this to your PR:
>
> - Self assign this PR to you (and anybody else helping you)
> - Set Carlos as the Reviewer
> - Add an appropriate label to the PR (typically `enhancement` or `bug`)
> - Optional: A description

By the end of each meeting, you should...

- Have an open and self-assigned PR
- Have some commits in the PR
- Optional: Resources, references, and links as comments that will be helpful to
  you or anybody helping you with this PR
