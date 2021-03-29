import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
   appId: 7803532,
   success: '',
   loading: false,
   error: '',
   user: {
      user_id: '',
      first_name: '',
      last_name: ''
   },
   posts: [],
   members_count: 0,
   searchGroupsList: [],
   selectGroup: 0,
   group: {},
   sort_by: {
      likes: 'likes',
      comments: 'comments',
      reposts: 'reposts',
      date: 'date'
   },
   select_sort: 'likes',
   sort_asc: true,
}

export const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {
      getRequest: (state, { payload }) => {
         state.loading = payload
      },
      setError: (state, { payload }) => {
         state.error = payload
      },
      loginSuccess: (state, { payload }) => {
         state.success = true
         state.error = ''
         state.user = {
            user_id: payload.id,
            first_name: payload.first_name,
            last_name: payload.last_name
         }
      },
      loginFail: (state, { payload }) => {
         state.error = payload
      },
      postsRequest: (state, { payload }) => {
         state.posts = payload
         state.loading = false
      },
      setMembers: (state, { payload }) => {
         state.members_count = payload.count
      },
      setSearchGroups: (state, { payload }) => {
         state.searchGroupsList = payload
      },
      cleareSearchGroups: state => {
         state.searchGroupsList = []
      },
      setGroup: (state, { payload }) => {
         state.group = {
            id: payload.id,
            name: payload.name,
            photo: payload.photo_200
         }
      },
      setSelectGroup: (state, { payload }) => {
         state.selectGroup = payload
         state.searchGroupsList = []
      },
      sorting: (state, { payload }) => {
         let { sort, dir } = payload

         state.posts = [...state.posts].sort((a, b) => {
            if (dir) {
               return parseInt(a[sort].count || a[sort]) - parseInt(b[sort].count || b[sort])
            }
            if (!dir) {
               return parseInt(b[sort].count || b[sort]) - parseInt(a[sort].count || a[sort])
            }
         })
         state.select_sort = sort
         state.sort_asc = dir
         state.loading = false
      }
   },
});

export const { getRequest, loginSuccess, 
   loginFail, postsRequest, setMembers, 
   setSearchGroups, setSelectGroup, 
   setGroup, cleareSearchGroups, sorting} = postsSlice.actions;


export const selectPosts = state => state.posts;

export default postsSlice.reducer;

const VK = window.VK && window.VK;

export function searchGroups(text) {
   return dispatch => {
      if (!text) {
         dispatch(cleareSearchGroups())
      } else {
         VK.Api.call('groups.search', {q: text, type: 'group', v: "5.73"}, (r) => {
            console.log('groups.search', r.response);
            if (r.response) dispatch(setSearchGroups(r.response.items))
         })
      }
   }
}

export function getPosts(group_id) {
   return dispatch => {
      dispatch(getRequest(true))

      const getGroups = () => {
         return new Promise(resolve=> {
            VK.Api.call('groups.getById', {group_id: group_id, v: "5.73"}, (r) => {
               resolve(r.response[0]);
            })
         })
      }

      const wallGet = (id) => {

         console.log('id', -id);
         return new Promise(resolve => {
            VK.Api.call('wall.get', {owner_id: -id, extended: 1,  v: "5.73"}, (r) => {

               console.log('wall.get', r);

               resolve(r.response.items);
            })
         })
      }

      const getMembers = () => {
         return new Promise(resolve => {
            VK.Api.call('groups.getMembers', {group_id: group_id, v: "5.73"}, (r) => {
               resolve(r.response);
            })
         })
      }


      getGroups()
         .then(group => {
            dispatch(setGroup(group))
            return wallGet(group.id)
         })
         .then(result => {
            dispatch(postsRequest(result))
            return getMembers()
         })
         .then(result => {
            dispatch(setMembers(result))
            dispatch(getRequest(false))
         })
         .catch(error => {
            console.log('err', error);
         })
   }
 }


export const Auth = () => async dispatch => {
   VK.Auth.login(r => {
      if (r.session) {
         
         console.log('r', r);
         let user = r.session.user
         dispatch(loginSuccess(user))
      } else {
         dispatch(loginFail('Ошибка авторизации'))
      }
      localStorage.setItem('status', r.status)
   }, 4)

}