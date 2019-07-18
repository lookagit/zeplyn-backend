/* eslint-disable */
const convertHTTPResponseToREST = (response, type, resource, params) => {
  switch (true) {
    case (type === 'GET_ONE' && resource === 'users'): {
      const [lon, lat] = response.location.geo.coordinates;
      return {
        data: {
          ...response,
          lat,
          lon
        }
      };
    }
    case (type === 'GET_ONE' && resource === 'events'): {
      const [lon, lat] = response.location.coordinates;
      return {
        data: {
          ...response,
          lat,
          lon
        }
      };
    }
    case (type === 'CREATE' && resource === 'users'): {
      const { events = [], followingGroups = [], friends = [] } = params.data;
      let eventsFollow = events.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${response.id}/follow-event/${item}`,
        { method: 'POST' }
      ))
      let groupsFollow = followingGroups.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${response.id}/join-group/${item}`,
        { method: 'POST' },
      ));
      let friendsRequestSend = friends.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${response.id}/send-request/${item}`,
        { method: 'POST' },
      ))
      const resolvedSentRequests = Promise.all(friendsRequestSend)
      .then(results => results.map(item => item.json()))
      .then(resolved => Promise.all(resolved))
      .then(results => results.map(item => {
        const [userSent, userReceive] = item;
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${userReceive._id}/approve-request/${userSent._id}`,
          { method: 'POST' }
        )
      }));
      return { data: { ...params.data, id: response.id } };
    }
    case (type === 'CREATE' && resource === 'groups'): {
      const { participants = [] } = params.data;
      participants.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${item}/join-group/${response.id}`,
        { method: 'POST' },
      ));
      return { data: { ...params.data, id: response.id } };
    }
    case (type === 'CREATE' && resource === 'events'): {
      const { participants = [] } = params.data;
      participants.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${item}/follow-event/${response.id}`,
        { method: 'POST' }
      ));
      return { data: { ...params.data, id: response.id } };
    }
    default:
      return { data: response };
  }
};

const addUploadCapabilities = requestHandler => (type, resource, params) => {
  switch (true) {
    case (type === 'UPDATE' && resource === 'groups'): {
      const { data = [], previousData = [], id } = params;
      const shouldJoinGroup = data.participants.filter(item => !previousData.participants.includes(item));
      const shouldLeaveGroup = previousData.participants.filter(item => !data.participants.includes(item));
      shouldJoinGroup.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${item}/join-group/${id}`,
        { method: 'POST' }
      ));
      shouldLeaveGroup.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${item}/unfollow-group/${id}`,
        { method: 'POST' }
      ));
      return requestHandler(type, resource, params);
    }
    case (type === 'CREATE' && resource === 'groups'): {
      const { data } = params;
      return fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/groups`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
        .then(response => response.json())
        .then(parsedResponse => convertHTTPResponseToREST(parsedResponse, type, resource, params));
    }
    case (type === 'CREATE' && resource === 'posts'): {
      const { data } = params;
      return fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${data.authorId}`,
        { method: 'GET'}
      )
      .then(response => response.json())
      .then(userFinded => {
        data.authorUsername = userFinded.username;
        return fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/posts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }
        )
      })
      .then(response => response.json())
      .then(parsedResponse => convertHTTPResponseToREST(parsedResponse, type, resource, params));
    }
    case (type === 'UPDATE' && resource === 'users'): {
      const { data = [], previousData = [], id } = params;
      data.location.geo.coordinates = [data.lon, data.lat];
      const shouldFollowEvent = data.events.filter(item => !previousData.events.includes(item));
      const shouldUnfollowEvent = previousData.events.filter(item => !data.events.includes(item));
      const shouldJoinGroup = data.followingGroups.filter(item => !previousData.followingGroups.includes(item));
      const shouldLeaveGroup = previousData.followingGroups.filter(item => !data.followingGroups.includes(item));
      const shouldUnfriendUser = previousData.friends.filter(item => !data.friends.includes(item));
      const shouldMakeFriend = data.friends.filter(item => !previousData.friends.includes(item));

      const friendsRequestSend = shouldMakeFriend.map(item => fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${id}/send-request/${item}`,
        { method: 'POST' },
      ))
      const resolvedSentRequests = Promise.all(friendsRequestSend)
      .then(results => results.map(item => item.json()))
      .then(resolved => Promise.all(resolved))
      .then(results => results.map(item => {
        const [userSent, userReceive] = item;
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${userReceive._id}/approve-request/${userSent._id}`,
          { method: 'POST' }
        )
      }));

      shouldUnfriendUser.map(item => 
      fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${id}/remove-friend/${item}`,
        { method: 'POST' }
      ));
      shouldFollowEvent.map(item =>
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${id}/follow-event/${item}`,
          { method: 'POST' }
        ));
      shouldUnfollowEvent.map(item =>
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${id}/unfollow-event/${item}`,
          { method: 'POST' }
        ));
      shouldJoinGroup.map(item =>
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${id}/join-group/${item}`,
          { method: 'POST' }
        ));
      shouldLeaveGroup.map(item =>
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${id}/unfollow-group/${item}`,
          { method: 'POST' }
        ));
      return requestHandler(type, resource, params);
    }
    case (type === 'UPDATE' && resource === 'events'): {
      const { data = [], previousData = [], id } = params;
      data.location.coordinates = [data.lat, data.lon];
      const shouldFollowEvent = data.participants.filter(item => !previousData.participants.includes(item));
      const shouldUnfollowEvent = previousData.participants.filter(item => !data.participants.includes(item));
      shouldFollowEvent.map(item =>
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${item}/follow-event/${id}`,
          { method: 'POST' }
        ));
      shouldUnfollowEvent.map(item =>
        fetch(
          `http://${process.env.REACT_APP_API_HOST}/api/users/${item}/unfollow-event/${id}`,
          { method: 'POST' }
        ));
      return requestHandler(type, resource, params);
    }
    case (type === 'CREATE' && resource === 'events'): {
      const { data } = params;
      const { lat, lon, ...rest } = data;
      const location = {
        coordinates: [lat, lon]
      };
      const newData = {
        ...rest,
        location
      };
      return fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData)
        }
      )
        .then(response => response.json())
        .then(parsedResponse => convertHTTPResponseToREST(parsedResponse, type, resource, params));
    }
    case (type === 'GET_ONE' && resource === 'events'): {
      return fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/events/${params.id}`,
        { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(response => response.json())
        .then(parsedResponse => convertHTTPResponseToREST(parsedResponse, type, resource, params));
    }
    case (type === 'CREATE' && resource === 'users'): {
      const { data } = params;
      const { lat, lon, ...rest } = data;
      const location = {
        geo: {
          type: 'Point',
          coordinates: [lat, lon]
        }
      };
      const newData = {
        ...rest,
        location
      };
      return fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData)
        }
      )
        .then(response => response.json())
        .then(parsedResponse => convertHTTPResponseToREST(parsedResponse, type, resource, params));
    }
    case (type === 'GET_ONE' && resource === 'users'): {
      return fetch(
        `http://${process.env.REACT_APP_API_HOST}/api/users/${params.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(response => response.json())
        .then(parsedResponse => convertHTTPResponseToREST(parsedResponse, type, resource, params));
    }
    default:
      return requestHandler(type, resource, params)
  }
};

export default addUploadCapabilities;
