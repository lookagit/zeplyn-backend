# Zeplyn app - backend

### Technologies
---
- #### Node
- #### Express
- #### Mongoose
- #### MongoDb 
---
# Model entities
- #### Users
- #### Posts
- #### Groups
- #### Events

## Users endpoint /api/users
---
#### ``` GET /api/users ```
- #### *Get list of users*
---
#### ``` POST /api/users ```
- #### *Create new user*
--- 
#### ``` GET /api/users/:userId ```
- #### Get user with :userId
---
#### ```PUT /api/users/:userId```
- #### *Update user with :userId*
---
#### ```DELETE /api/users/:userId```
- #### *Update user with :userId*
---
#### ```GET /api/users/:userId/user-search-posts/:queryString```
- #### *Finds posts with :queryString in text, owners username or group name*
---
#### ```POST /api/users/:userId/find-nearest-friends```
- ####  *Users near(Geo) friends*
---
#### ```POST /api/users/userId find-nearest-friends-coordinates ```
- #### *User near(Geo) friends  Array of objects with _id and coordinates*
- ###### params ````{minDistance, maxDistance}````
---
#### ``` POST /api/users/:userId/create-post ```
- ####  *User create post*
---
#### ```DELETE /api/users/:userId/user-delete-post ```
- #### *User delete post*
---
#### ```POST /api/users/:userId/create-post ```
- #### *User create post*
---
#### ``` PUT /api/users/:userId/user-edit-post ```
- #### *User editing post*
---
#### ```DELETE /api/users/:userId/user-delete-post ```
- #### *User delete post*
---
#### ``` POST /api/users/user-create-reply ```
- #### *User create reply on post*
#### ```PUT api/users/:userId/user-edit-reply ```
- #### *User editing reply*
---
#### ```DELETE /api/users/user-remove-reply ```
- #### *User remove reply on post*
---
#### ``` GET /api/users/:userId/get-position```
- #### *User current position*
---
#### ```POST /api/users/:userId/user-create-group```
- #### *User create group*
---
#### ```DELETE /api/users/:userId/user-remove-group ```
- #### *User remove group*
---
#### ```PUT /api/users/:userId/createEvent User```
- #### *Create new event*
---
#### ```DELETE /api/users/:userId/createEvent```
- #### *User delete event*
---
#### ```POST /api/users/:userId/join-group/:groupId```
- #### *User following group*
---
#### ```POST /api/users/:userId/unfollow-group/:groupId```
- #### *User unfollowing group*
---
#### ```POST /api/users/:userId/find-nearest/```
- #### *Find nearest Users*
---
#### ```POST /api/users/:userId/find-nearest/```
- #### *find nearest Users*
-  ###### params ````{minDistance, maxDistance}````
---
#### ```POST /api/users/:userId/join-group/:groupId```
- #### *User send request*
---
#### ```POST /api/users/:userId/block-user/:blockUserId```
- #### *User blocking another user*
---
#### ```POST /api/users/:userId/unblock-user/:unblockUserId```
- #### *User unblocking another user*
---
#### ```POST /api/users/:userId/remove-friend/:unfriendUserId ```
- #### *User removing another user from friends*
---
#### ```POST /api/users/:userId/create-event/:eventId```
- #### User create event
---
#### ```POST /api/users/:userId/create-event/:eventId```
- #### *User removing event*
---
#### POST /api/users/:userId/update-position/
- #### Update users position 
- ###### params ````{minDistance, maxDistance}````
- --
#### ```POST /api/users/:userId/approve-request/:userForApproveId```
- #### Approves user friend request
---