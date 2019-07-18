import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';
import authClient from './authClient';
import EventsList, { EventsCreate, EventsEdit, EventShow } from './events';
import UserList, { UserEdit, UserCreate, UserShow } from './users';
import GroupList, { GroupEdit, GroupCreate, GroupShow } from './groups';
import PostList, { PostsCreate } from './posts';
import addUploadCapabilities from './restConvert';

const restClient = jsonServerRestClient(`http://${process.env.REACT_APP_API_HOST}/api`);

const uploadClient = addUploadCapabilities(restClient);
const App = () => (
  <Admin authClient={authClient} restClient={uploadClient}>
    <Resource name="users" show={UserShow} list={UserList} edit={UserEdit} create={UserCreate} />
    <Resource name="events" show={EventShow} list={EventsList} edit={EventsEdit} create={EventsCreate} />
    <Resource name="groups" show={GroupShow} list={GroupList} edit={GroupEdit} create={GroupCreate} />
    <Resource name="posts" list={PostList} create={PostsCreate} />
  </Admin>
);

export default App;
