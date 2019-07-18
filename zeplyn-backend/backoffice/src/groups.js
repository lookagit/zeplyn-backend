import React from 'react';
import {
  TextInput,
  LongTextInput,
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  Create,
  Show,
  SimpleShowLayout,
  ShowButton,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  ReferenceArrayInput,
  SelectArrayInput
} from 'admin-on-rest';

const GroupList = props => (
  <List title="All groups" {...props}>
    <Datagrid>
      <TextField label="Id" source="id" />
      <TextField label="Name" source="name" />
      <TextField label="Description" source="description" />
      <TextField label="Created at" source="createdAt" />
      <TextField label="Avatar" source="avatar" />
      <ReferenceArrayField label="Participants" reference="users" source="participants">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const GroupEdit = props => (
  <Edit title="Group edit" {...props}>
    <SimpleForm>
      <TextInput label="Group name" source="name" />
      <LongTextInput label="Group description" source="description" />
      <TextInput label="Created at" source="createdAt" />
      <TextInput label="Avatar" source="avatar" />
      <ReferenceArrayInput label="Group participants" source="participants" reference="users" allowEmpty >
        <SelectArrayInput optionText="username" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const GroupCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Group name" source="name" />
      <LongTextInput label="Group description" source="description" />
      <TextInput label="Avatar" source="avatar" />
      <ReferenceArrayInput label="Group participants" source="participants" reference="users" allowEmpty>
        <SelectArrayInput optionText="username" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

export const GroupShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField label="Id" source="id" />
      <TextField label="Name" source="name" />
      <TextField label="Description" source="description" />
      <TextField label="Created at" source="createdAt" />
      <TextField label="Avatar" source="avatar" />
      <ReferenceArrayField label="Participants" reference="users" source="participants">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
export default GroupList;
