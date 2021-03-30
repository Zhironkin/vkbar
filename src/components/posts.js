import React from 'react';
import { GridList, GridListTile } from '@material-ui/core';
import { FavoriteBorder as LikeIcon, ChatBubbleOutline as CommentsIcon,
  Repeat as ReplyIcon } from '@material-ui/icons';

  
const Posts = ({ posts, members_count }) => {

   const custom_attach = (data, i) => (data || []).map((item, index) => {
      if (index >= 9) return null

      let { photo, type, video } = item

      if ( type === 'photo' ) {
         return (
            <GridListTile key={photo.id} cols={1}>
               <img src={photo.photo_604} />
            </GridListTile>
         )
      }

      if ( type === 'video' ) {
         return (
            <GridListTile key={video.id} cols={1}>
               <img src={video.first_frame_800} />
            </GridListTile>
         )
         // dispatch(getVideo(video)).then(result => {
         //    let _posts = [...posts]
         //    _posts[i].attachments[index].video = {...result.items[0]}
         //    // dispatch(postsRequest(_posts))
         // })
      }
   })

   const dateFormat = item => item.toString().length === 1 ? `0${item}` : item

   const ERpost = item => {
      let totalReaction = item.likes.count + item.reposts.count + item.comments.count + (item.views ? item.views.count : 0)
      let ER = (totalReaction / members_count) * 100

      return 'ERpost ' + ER.toFixed(2) + '%'
   }

   const textFormat = text => text.split("\n").map((item, key) => (<div key={key.toString()}>{item}</div>))

   const renderPosts = () => (posts || []).map(item => {

      if ( item.copy_history ) return item.copy_history.map(copy => renderBodyPost(copy, true))

      return renderBodyPost(item, false)
      
   })

   const renderBodyPost = (post, copy_history) => {
      let date = new Date(post.date * 1000)

      let photo_length = post.attachments && post.attachments.filter(item => item.type === 'photo').length
      let cols = photo_length && photo_length > 2 ? Math.ceil(photo_length / 3) : 1

      return (
         <div key={post.id.toString()} className={"post" + (copy_history ? " copy_history" : "")}>
            <div className="post-header">
               {textFormat(post.text)}
            </div>
            <div className="post-body">
               {(post.attachments || post.copy_history) && 
                  <GridList cellHeight={cols >= 2 ? 180 : 'auto'} className="grid" cols={cols}>
                     {custom_attach(post.attachments || post.copy_history)}
                  </GridList>
               }
            </div>
            {!copy_history && 
               <div className="post-footer">
                  <div className="date">
                     {dateFormat(date.getDate())}.{dateFormat(date.getMonth() + 1)}.{date.getFullYear()}
                     {' / '}
                     {dateFormat(date.getHours())}:{dateFormat(date.getMinutes())}
                  </div>
                  <div>{ERpost(post)}</div>
                  <div className="likes"><LikeIcon /> {post.likes.count > 0 && post.likes.count}</div>
                  <div className="reposts"><ReplyIcon /> {post.reposts.count > 0 && post.reposts.count}</div>
                  <div className="comments"><CommentsIcon /> {post.comments.count > 0 && post.comments.count}</div>
               </div>
            }
         </div>
      )
   }


   return (
      <div className="posts">
         {renderPosts()}
      </div>
   )
}

export default Posts;