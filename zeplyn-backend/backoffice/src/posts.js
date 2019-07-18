import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Create,
  SimpleForm,
  ReferenceField,
  NumberInput,
  TextInput,
  DateInput,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput
} from 'admin-on-rest';

const PostList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="text" />
      <TextField source="image" />
      <TextField source="likes" />
      <TextField source="createdAt" />
      <TextField source="groupName" />
      <ReferenceField label="Author" source="authorId._id" reference="users">
        <TextField source="username" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export const PostsCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Post text" source="text" />
      <TextInput label="Post image" source="image" />
      <NumberInput label="Post likes" source="likes" />
      <DateInput label="Post created at" source="createdAt" />
      <ReferenceInput label="User creator" source="authorId" reference="users" allowEmpty>
        <SelectInput optionText="username" />
      </ReferenceInput>
      <ReferenceArrayInput label="Posts replies" source="replies" reference="posts" allowEmpty >
        <SelectArrayInput optionText="text" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

export default PostList;
