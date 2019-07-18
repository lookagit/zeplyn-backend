import React from 'react';
import {
  TextInput,
  LongTextInput,
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  Edit,
  SimpleForm,
  Create,
  Show,
  SimpleShowLayout,
  ReferenceArrayField,
  ReferenceArrayInput,
  SelectArrayInput,
  DateInput,
  SingleFieldList,
  ChipField,
  NumberInput,
  FunctionField
} from 'admin-on-rest';
import MapView from './MapView';

const tzOffset = new Date().getTimezoneOffset() / 60;
const dateParser = (v) => {
  const regexp = /(\d{4})-(\d{2})-(\d{2})/
  let match = regexp.exec(v);
  let year;
  let month;
  let day;
  if (match === null) return;
  [, year, month, day] = match;
  if (tzOffset < 0) {
    // negative offset means our picked UTC date got converted to previous day
    const date = new Date(v);
    date.setDate(date.getDate() + 1);
    match = regexp.exec(date.toISOString());
    [, year, month, day] = match;
  }
  const d = [year, month, day].join('-');
  return d;
};

const EventsList = props => (
  <List title="All events" {...props}>
    <Datagrid>
      <TextField label="Id" source="id" />
      <TextField label="Name" source="name" />
      <TextField label="Subtitle" source="subtitle" />
      <TextField label="Description" source="description" />
      <TextField label="Created at" source="createdAt" />
      <TextField label="Category" source="category" />
      <TextField label="Website" source="website" />
      <TextField label="Price" source="price" />
      <TextField label="Image" source="image" />
      <TextField label="Date start" source="date.start" />
      <TextField label="Date end" source="date.finished" />
      <TextField label="Opening" source="openingHours.open" />
      <TextField label="Closing" source="openingHours.close" />
      <TextField label="Address" source="address" />
      <FunctionField label="Lat" render={record => `${record.location.coordinates[1]}`} />
      <FunctionField label="Lon" render={record => `${record.location.coordinates[0]}`} />
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

export const EventsEdit = props => (
  <Edit title="Event edit" {...props}>
    <SimpleForm>
      <TextInput label="Event name" source="name" />
      <LongTextInput label="Event description" source="description" />
      <TextInput label="Event subtitle" source="subtitle" />
      <TextInput label="Event category" source="category" />
      <TextInput label="Event website" source="website" />
      <NumberInput label="Event price" source="price" />
      <TextInput label="Event image" source="image" />
      <NumberInput label="Location Lat" source="lat" />
      <NumberInput label="Location Lon" source="lon" />
      <DateInput parse={dateParser} label="Event start date" source="date.start" />
      <DateInput parse={dateParser} label="Event finish date" source="date.finished" />
      <TextInput label="Event address" source="address" />
      <TextInput label="Event opening hours" source="openingHours.open" />
      <TextInput label="Event closing hours" source="openingHours.close" />
      <ReferenceArrayInput label="Event participants" source="participants" reference="users" allowEmpty >
        <SelectArrayInput optionText="username" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const EventsCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput label="Event name" source="name" />
      <TextInput label="Event subtitle" source="subtitle" />
      <LongTextInput label="Event description" source="description" />
      <TextInput label="Event category" source="category" />
      <TextInput label="Event website" source="website" />
      <NumberInput label="Event price" source="price" />
      <TextInput label="Event image" source="image" />
      <NumberInput label="Event Lat" source="lat" />
      <NumberInput label="Event Lon" source="lon" />
      <DateInput parse={dateParser} label="Event start date" source="date.start" />
      <DateInput parse={dateParser} label="Event finish date" source="date.finished" />
      <TextInput label="Event address" source="address" />
      <TextInput label="Event opening hours" source="openingHours.open" />
      <TextInput label="Event closing hours" source="openingHours.close" />
      <ReferenceArrayInput label="Event participants" source="participants" reference="users" allowEmpty>
        <SelectArrayInput optionText="username" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

export const EventShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField label="Id" source="id" />
      <TextField label="Name" source="name" />
      <TextField label="Subtitle" source="subtitle" />
      <TextField label="Description" source="description" />
      <TextField label="Created at" source="createdAt" />
      <TextField label="Category" source="category" />
      <TextField label="Website" source="website" />
      <TextField label="Price" source="price" />
      <TextField label="Image" source="image" />
      <TextField label="Date start" source="date.start" />
      <TextField label="Date end" source="date.finished" />
      <TextField label="Address" source="address" />
      <TextField label="Opening" source="openingHours.open" />
      <TextField label="Closing" source="openingHours.close" />
      <MapView source="location" />
      <ReferenceArrayField label="Participants" reference="users" source="participants">
        <SingleFieldList>
          <ChipField source="username" />
        </SingleFieldList>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
export default EventsList;
