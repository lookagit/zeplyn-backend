import React from 'react';
import {
  TextInput,
  List,
  Datagrid,
  EmailField,
  TextField,
  EditButton,
  Edit,
  DisabledInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  SimpleForm,
  Create,
  DateField,
  ShowButton,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  SelectArrayInput,
  ReferenceArrayInput,
  NumberInput
} from 'admin-on-rest';
import UploaderImage from './UploadImage';

const UserList = props => (
  <List title="All users" {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="phone" />
      <TextField source="socialNetwork" />
      <TextField source="createdAt" />
      <TextField source="avatar" />
      <TextField source="status" />
      <TextField source="lat" />
      <TextField source="lon" />
      <TextField label="Location Prov." source="locationProvider" />
      <ReferenceArrayField label="Events" reference="events" source="events">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Groups" reference="groups" source="followingGroups">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Friends" reference="users" source="friends">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const UserEdit = props => (
  <Edit title="User edit" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput label="Username" source="username" />
      <TextInput label="Email" source="email" />
      <TextInput label="Phone" source="phone" />
      <TextInput label="Social network" source="socialNetwork" />
      <TextInput label="Avatar" source="avatar" />
      <TextInput label="Location provider" source="locationProvider" />
      <NumberInput label="Lat" source="lat" />
      <NumberInput label="Lon" source="lon" />
      <SelectInput
          source="status"
          choices={[
            { id: 'offline', name: 'Offline' },
            { id: 'available', name: 'Available' },
            { id: 'busy', name: 'Busy' }
          ]}
      />
      <ReferenceArrayInput label="Events" source="events" reference="events" allowEmpty >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Groups" source="followingGroups" reference="groups" allowEmpty >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Users" source="friends" reference="users" allowEmpty >
        <SelectArrayInput optionText="username" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Username" source="username" />
      <TextInput label="Email" source="email" />
      <TextInput label="Phone" source="phone" />
      <TextInput label="Social network" source="socialNetwork" />
      <TextInput label="Avatar" source="avatar" />
      <TextInput label="Location provider" source="locationProvider" />
      <NumberInput label="Lat" source="lat" />
      <NumberInput label="Lon" source="lon" />
      <SelectInput
          source="status"
          choices={[
            { id: 'offline', name: 'Offline' },
            { id: 'available', name: 'Available' },
            { id: 'busy', name: 'Busy' }
          ]}
      />
      <ReferenceArrayInput label="Events" source="events" reference="events" allowEmpty >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Groups" source="followingGroups" reference="groups" allowEmpty >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Friends" source="friends" reference="users" allowEmpty >
        <SelectArrayInput optionText="username" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

export const UserShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField label="ID" source="id" />
      <TextField label="Username" source="username" />
      <TextField label="Email" source="email" />
      <TextField label="Phone" source="phone" />
      <TextField label="Social network" source="socialNetwork" />
      <TextField label="Avatar" source="avatar" />
      <DateField label="Created at" source="createdAt" />
      <TextField label="Status" source="status" />
      <TextField label="Location provider" source="locationProvider" />
      <TextField label="Location Lat" source="lat" />
      <TextField label="Location Lon" source="lon" />
      <ReferenceArrayField label="Events" reference="events" source="events">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Groups" reference="groups" source="followingGroups">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Friends" reference="users" source="friends">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Friend request sent" reference="users" source="addedFriendRequest">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Friend requests received" reference="users" source="receivedFriendRequest">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Blocked users" reference="users" source="blockedUsers">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField label="Blocked by users" reference="users" source="blockedBy">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
      <UploaderImage />
    </SimpleShowLayout>
  </Show>
);

export default UserList;
