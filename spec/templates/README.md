# How to use the 6P Specification System

6P is a formalized approach that seeks to follow the needs of software developement and business development.

It is a combination of logbook, documentation and specification system.

![drawing](/spec/templates/images/6P-Lifecycle.png)

## Lifecycle in the evolution of specifications
From the perspective of engineering, it is important to evolve a specification throughout the scope of work, offer an "entry point" for stakeholders to participate and review the state of the work and prepare documentation of the project.

Engineering is an iterative process that moves from raw ideas to stable implementations. As projects evolve, specifications evolve, become deprecated and eventually retired. This means that first and foremost, specifications need to be easy to write, modify and publish. There must be a way to discover the current version of any specification and it must be from the perspective of the humans that will be interacting with it.

### Proposal
A proposal is a statement of intent that presents the scope of a product from the point of view of the business and the user. This phase is intended to define `what` a project is about.

Common work in this phase would be to get the stakeholders to agree upon a Request for Information (RFI). There may be multiple RFI's in the proposal stage and prototyping stages, but during the proofing and production phases there may only be one "winning" RFI.

It is possible that the team decides to Prune the Proposal (or entire project) in this phase. (Fail-early)

### Prototype
The prototype phase could be aligned closely with "pre-alpha" software in the context of semantic versioning. The completion of the prototype phase results in "alpha" quality software.

As a reminder, "alpha" software is software that generally speaking works, is likely to be buggy and will quite likely have its interfaces and shape changed one or more times as it matures to Beta state.

This phase seeks to identify the ideal RFI (if there are multiple) and "solidifies" the project scope, technology applied and general architectural patterns.

Common work in this phase is to write and maintain Requests for Proposal (RFP), which serve to log the work done, approaches investigated and act as a "logbook" for the components of the software.

To receive the `@alpha` grading, the project MUST have detailed Engineering specifications. (see below)

It is possible that the team decides to Prune the Prototype (or entire project) in this phase. (Fail-early)

### Proofing
Proofing of a product is the stage in development where the engineering team focuses on testing, fuzzing, benchmarking and basically proving that the product is secure and of the highest quality. It is the last chance to change the interface or fix underlying problems.

In this stage it is imperative that continuous integration systems are implemented, that distributables are validated and that the Engineering Schema matches the specification.

It is imperative in public projects that the community is brought in at this stage, if they have not yet been involved in earlier work. Especially in the context of "intuitive and friendly" libraries, feedback at this stage will help the "social" aspect of the software release.

In this stage, where all things are "mostly finished", an RFC process is absolutely essential for affecting changes in a fashion that enables  stakeholder involvement. Similar to the RFI and RFP workflows, an RFC exists as a last chance to modify integral parts of the product before it receives the `@beta` grading.

This stage is also the first point in time at which it makes sense for the Requirements Specs to be initiated.

### Production


### dePrecation

### Posterity

## Component Parts

### Request for Information (RFI)
A request for information is the kickoff for a project, which serves as a basis for discussion. It should be product-driven and user-oriented.

### Request for Proposals (RFP)
A request for proposals is an aspect of the prototyping phase, which seeks to detail a system component and investigate ways to make it work.

### RFC
A request for comments is a proposed change to a system that has stabilised, such as when a project is in beta - or when a (potential) contributor feels that a change is important.

### Engineering Specs
The detailing of Engineering Specs can vary from project to project (and underlying programming language), but generally can be expected to cover the following concerns:

- Introduction
- Implementation Details
  - Naming Conventsion
  - Programming language(s)
- Constituent parts overview
  - Schemas
  - API / Endpoints
- Flow Diagrams
- Individual parts
  - Name
  - Parameters with name, description, type, example
  - Errors thrown
  - Return values
  - Side Effects
  - Example (in primary language)
- Build tools
- Testing
- Auditing
-

This is a real "living document" and should reflect the current state of the software at all times. It is a contract between developers of the project and consumers of the project. Where possible, automation SHOULD be used.

### Requirements Specs
A Requirements Spec is a business-layer document that seeks to use as plain an English as possible for the scope of work in order to completely describe the product.

It can be worked upon throughout the lifecycle of a product, however there are a few concerns:

1. Starting too soon may be a waste of time, because during the Proposal and Prototype phases many things can change - and indeed the entire project might get shelved.
2. It is "documentary" and not "executive". This means that it MUST NOT change the shape, meaning or approach of the software.

Generally speaking, there are three major components of a Requirements Specification:

#### 1. Conceptual Model
The conceptual model seeks to define at a high level how the product works.

#### 2. Structural Model
The structural model shows how the parts of the product fit together and exist in the larger ecosystem.

#### 3. Behavioral Model
The behavioral model explains how the system behaves at runtime.
