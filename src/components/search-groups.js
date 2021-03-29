import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectPosts, searchGroups, setSelectGroup } from '../slices/postsSlice';
import useDebounce from '../app/useDebounce';

const SearchGroups = () => {

   const dispatch = useDispatch()
   const [value, setValue] = useState('')
   const SearchGroups = useDebounce(value, 500)

   const { searchGroupsList, selectGroup } = useSelector(selectPosts)

   useEffect(() => {
      dispatch(searchGroups(SearchGroups))    
   }, [SearchGroups])

   useEffect(() => {
      setValue('')
   }, [dispatch, selectGroup])

   const renderGroups = () => {
      if (searchGroupsList.length) {
         return searchGroupsList.map(item => (
            <div key={item.id} onClick={() => dispatch(setSelectGroup(item.id))}>
               <div>
                  <img src={item.photo_50} />
               </div>
               <div>
                  {item.name}
               </div>
            </div>
         ))
      }

      return <div className="no-result">No result</div>
   }

   return (
      <div className="search-group">
         <TextField className="search" autoComplete="off" onChange={e => setValue(e.target.value)} label="Поиск группы" variant="outlined" />

         {searchGroupsList.length > 0 && 
            <div className="group-list">
               {renderGroups()}
            </div>
         }
      </div>
   )
}

export default SearchGroups;