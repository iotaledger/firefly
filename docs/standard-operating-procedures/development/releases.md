---
icon: rocket
---

# Releases

## Purpose

This document details the standard operating procedure (SOP) for managing the releases of the Firefly Application, so that anyone one of the maintainers can correctly create a release.

## Scope

This SOP is only applicable to maintainers of this repository, that are responsible for the release process. Currently this SOP only covers Desktop releases for Linux, Mac and Windows.

## Responsibilities

| Role | Person |
| - | :-: |
| Primary Release Manager | @Nicole |
| Secondary Release Manager | ??? |

## Schedule

* Once a month on the last wednesday the regular release process will be initiated.
* The milestone release process will happen for larger milestone based releases, or releases of new platforms.
* Hotfixes will occur when there is an important fix that needs to be deployed on a currently released version, before the next regular rlease.

## Processes

* [Release Versioning](#release-versioning)
* [Regular Releases](#regular-releases)
* [Milestone Releases](#milestone-releases)
* [Hotfix Releases](#hotfix-releases)

## External References

* [(Git Guide) Branches](../../guides/git/branches.md)
* [(Git Guide) Pull Requests](../../guides/git/pull-requests.md)

---

## Release Versioning

We aim to follow a release versioning convention as close to semantic versioning as possible.

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> * MAJOR version when you make incompatible API changes,
> * MINOR version when you add functionality in a backwards compatible manner, and
> * PATCH version when you make backwards compatible bug fixes.
>
> Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

i.e. our versioning will look like:
`1.3.4`

Where we use the optional channel and build number for pre-releases.
`1.3.4-alpha-1`
`1.3.4-beta-1`

In tags and branches, the versioning will also be prefixed with the platform:
`desktop-1.4.0` - branch or production release tag
`desktop-1.0.0-alpha-1` - pre-release tag

---

## Regular Releases

The regular release process should be followed monthly according to the schedule defined in this SOP. This is to ensure we are providing consistent updates and bug fixes for all platforms.

> As a prerequisite to the release process, both the branching strategy and PR management process are to be followed.

For the regular release process we will aim to follow the below sub processes:

### 1. PR Freeze & Release Branch

When the regular release process is initiated, the first step is to issue a PR freeze (on the develop branch) to all the maintainers. This will be a simple reminder to tell them that no more PRs will be merged into develop after a given time, until the release branch has been created.

*This includes all PR regardless of specific target platform, as the code is closely linked for all platforms.*

> Usually the release branch will be created in a short time afterwards. But, if it is deemed necessary, it can be decided on a release basis that we will postpone the creation of a release branch until an important PR is merged into develop. The PR freeze will remain for non-important PRs, and they can be marked with the `donotmerge` label as a reminder.

We will then create the release branch with the following branch naming convention `release/<platform>-<version>`; and the PR freeze will be lifted.

Then we will increment the minor version number in the `package.json` file.

### 2. Internal Testing

Once the release branch has been created, as a team we can all build the release branch locally, and test all the core functionality of the application. Testing of additional functionality will be based, on what features have be added or changed in this version.

This will usually last between half a day and 2 days. Any updates can be opened as PRs directly on the release branch (this is because we don't want to prevent changes to develop affecting the release). When we are happy that the application passes our testings criteria we can move on to the next steps.

### 3. Security Audit (Optional)

For each release we will decide if and what parts of the application will need to go through the security audit process. This process will be done in parallel to the beta release. If a security audit is deemed necessary, production release will be dependent on the successful completion of said audit.

### 4. Beta Testing

In parallel or in absence of the security audit, we will begin beta testing the next releases. This is will be a public version of the application, that will have the beta release flag enabled.

#### A. Release

First we create a release, by tagging the latest commit on the release branch and pushing it to the GH repository. The tag should be created with the following naming convention `<platform>-<version>-beta-<build no>`; so that the correct workflow is used to create the release builds.

Once the tag is pushed, GH should build the application for the correct platform and release channel i.e. release channel being beta in this instance. And then create a draft GH release with the artifacts.

The release manager, can then edit the release in GH with the change log and beta testing instructions. Followed by, publishing the GH release (ensuring the pre-release option is checked) and creating an entry in the GH announcements discussion.

#### B. Testing

After a beta release has been published, we now need to communicate the release to the public by posting an announcement and changelog in:

* Discord #firefly-beta-testing thread
* Discord #tech-announcments channel

Beta testing instructions will be referenced in the announcement and these will be defined in the release description. In short, the public will be encouraged to test the application and new features using a developer profile and connected to the respective devnet. The testers can then discuss issues directly in the firefly beta testing thread, or in the release announcement on the GH wiki, before making a bug report in GH if needed.

#### C. Fixes

If fixes are needed berfore a release, they can be created as PRs targeting the release branch. If there are fixes that we would like to be retested, we can create a new beta release by going back to step A and incrementing the build number each time.

### 5. Tag and Release

After sufficient beta testing and fixes have been merged into the release branch. We may then release the application as production ready. This involves:

* Creating a tag on the latest stable commit in the release branch with the following naming convention `<platform>-<version>` and pushing to the GH repo
* The production build automatically starts using GH action when the tag is pushed
* Once the production build is finished a draft release is generated in GH
* This release can be edited to include the complete, human readable change log
* When ready this GH release can be published and an entry to the announcement channel on GH discussions should be generated
* The website will automatically pickup the GH release
* Once published on GH and the website, we can initiate the action to upload to S3, where the wallet automatically picks up the new release
* After the release has been published in three areas, we can swiftly announce the new version in:
  * slack channel TBD
  * Discord #firefly-discussion channel
  * Discord #tech-announcements channel
  * Optionally, twitter accounts can share this announcement too

### 6. Merging Release Branch

After the application has been released we can then merge the release branch into both `main` and `develop` branch to ensure they have the latest updates.

* Do **not** use squash and merge at this point as we will loose the commit history used for the changelog
* Do **not** delete the release branch, as it will be used as the base for hotfixes in the future

---

## Milestone Releases

The milestone release process is should be followed for large milestones, where we have been using a milestone branch, as opposed to creating PRs directly onto the develop branch.

> As a prerequisite to the release process, both the branching strategy and PR management process are to be followed.

For the milestone release process we will aim to follow the below sub processes:

### 1. Internal Testing

Once the majority of tasks have been completed for a specific milestone, as a team we can all build the milestone branch locally, and test all the core functionality of the application, as well as testing all the additional features and functionality that is included in the milestone.

This will usually last between a day and 1 week. Any updates can be opened as PRs directly on the milestone branch. When we are happy that the application passes our testings criteria we can move on to the next steps.

### 2. Alpha Testing

With the milestone releases, we will utilise a closed testing group so that we can gather wider feedback and testing capabilities before the feature is released to the public. This will be a private build of the application using the alpha release flag.

#### A. Release

First we create a release, by tagging the latest commit on the milestone branch and pushing it to the GH repository. The tag should be created with the following naming convention `<platform>-<version>-alpha-<build no>`; so that the correct workflow is used to create the release builds.

Once the tag is pushed, GH should build the application for the correct platform and release channel i.e. release channel being alpha in this instance. And then create a draft GH release with the artifacts.

The release manager, can then edit the release in GH with the change log and beta testing instructions. Followed by, publishing the GH release (ensuring the pre-release option is checked) and creating an entry in the GH announcements discussion.

#### B. Testing

After a beta release has been published, we now need to communicate the release to the closed testing group by posting an announcement and changelog in:

* Discord #firefly-alpha-testing thread

Alpha testing instructions will be referenced in the announcement and these will be defined in the release description. In short, the closed testing group will be encouraged to test the application and new features using a developer profile and connected to the respective devnet. The testers can then discuss issues directly in the firefly alpha testing thread, or in the release announcement on the GH wiki, before making a bug report in a dedicated online document.

#### C. Fixes

If fixes are needed berfore a beta release, they can be created as PRs targeting the milestone branch. If there are fixes that we would like to be retested, we can create a new alpha release by going back to step A and incrementing the build number each time.

### 3. Merging Milestone Branch & Create Release Branch

After sufficient internal testing and alpha testing, a PR containing the milestone branch can then can then be reviewed on GH and follow the normal PR process; except we should have a minimum of two approvers to merge the milestone into the release branch as it will contain a large amount of changes.

Once the approced and merged is in the `develop` branch, we can create a release branch following the naming conventions defined in the branching strategy.

### 4. Security Audit (Optional)

For each release we will decide if and what parts of the application will need to go through the security audit process. This process will be done in parallel to the beta release. If a security audit is deemed necessary, production release will be dependent on the successful completion of said audit.

### 5. Beta Testing (Optional)

In parallel or in absence of the security audit, we can begin beta testing the next releases. This is will be a public version of the application, that will have the beta release flag enabled.

#### A. Release

First we create a release, by tagging the latest commit on the release branch and pushing it to the GH repository. The tag should be created with the following naming convention `<platform>-<version>-beta-<build no>`; so that the correct workflow is used to create the release builds.

Once the tag is pushed, GH should build the application for the correct platform and release channel i.e. release channel being beta in this instance. And then create a draft GH release with the artifacts.

The release manager, can then edit the release in GH with the change log and beta testing instructions. Followed by, publishing the GH release (ensuring the pre-release option is checked) and creating an entry in the GH announcements discussion.

#### B. Testing

After a beta release has been published, we now need to communicate the release to the public by posting an announcement and changelog in:

* Discord #firefly-beta-testing thread
* Discord #tech-announcments channel

Beta testing instructions will be referenced in the announcement and these will be defined in the release description. In short, the public will be encouraged to test the application and new features using a developer profile and connected to the respective devnet. The testers can then discuss issues directly in the firefly beta testing thread, or in the release announcement on the GH wiki, before making a bug report in GH if needed.

#### C. Fixes

If fixes are needed berfore a release, they can be created as PRs targeting the release branch. If there are fixes that we would like to be retested, we can create a new beta release by going back to step A and incrementing the build number each time.

### 6. Tag and Release

After sufficient beta testing and fixes have been merged into the release branch. We may then release the application as production ready. This involves:

* Creating a tag on the latest stable commit in the release branch with the following naming convention `<platform>-<version>` and pushing to the GH repo
* The production build automatically starts using GH action when the tag is pushed
* Once the production build is finished a draft release is generated in GH
* This release can be edited to include the complete, human readable change log
* When ready this GH release can be published and an entry to the announcement channel on GH discussions should be generated
* The website will automatically pickup the GH release
* Once published on GH and the website, we can initiate the action to upload to S3, where the wallet automatically picks up the new release
* After the release has been published in three areas, we can swiftly announce the new version in:
  * slack channel TBD
  * Discord #firefly-discussion channel
  * Discord #tech-announcements channel
  * Optionally, twitter accounts can share this announcement too

### 7. Merge Release Branch

After the milestone has been released we can then merge the release branch into both `main` and `develop` branch to ensure they have the latest updates.

* Do **not** use squash and merge at this point as we will loose the commit history used for the changelog
* Do **not** delete the release branch, as it will be used as the base for hotfixes in the future

---

## Hotfix Releases

The hotfix release process commences when a maintainer creates a PR with a hotfix targetting a previous release.

> A hotfix is any PR that is targeting a previous release directly, and as such should be released after merging into the release branch.

To release a hotfix we will aim to follow the below sub processes.

### 1. Internal Testing

Once the the PR is deemed ready for a review, as a team we can all build the hotfix branch locally, and test all the core functionality of the application, as well as hotfix functionality.

This will usually last between half a day and 1 full day. Any updates can be commited directly to the hotfix branch. When we are happy that the application passes our testings criteria we can move on to the next steps.

### 2. PR Approval & Merge Release Branch

After sufficient internal testing, the code can then be reviewed on GH and follow the normal PR process; except we should have a minimum of two approvers to merge the hotfix into the release branch as it is going to be released without additional alpha or beta testings.

### 3. Tag and Release

Once the hotfix has been merged into the release branch; we may then release the application as production ready. This involves:

* Creating a tag on the latest stable commit in the release branch with the following naming convention `<platform>-<version>` and pushing to the GH repo
* The production build automatically starts using GH action when the tag is pushed
* Once the production build is finished a draft release is generated in GH
* This release can be edited to include the complete, human readable change log
* When ready this GH release can be published and an entry to the announcement channel on GH discussions should be generated
* The website will automatically pickup the GH release
* Once published on GH and the website, we can initiate the action to upload to S3, where the wallet automatically picks up the new release
* After the release has been published in three areas, we can swiftly announce the new version in:
  * slack channel TBD
  * Discord #firefly-discussion channel
  * Discord #tech-announcements channel
  * Optionally, twitter accounts can share this announcement too

### 4. Merge Release Branch

After the hotfix has been released we can then merge the release branch into both `main` and `develop` branch to ensure they have the latest updates.

* Do **not** use squash and merge at this point as we will loose the commit history used for the changelog
* Do **not** delete the release branch, as it will be used as the base for hotfixes in the future

