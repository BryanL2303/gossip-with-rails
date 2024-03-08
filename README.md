# README
This was created for CVWO 2023 Winter Assignment
Frontend: React 
Backend: Ruby on Rails 
Database: Postgresql

Link to website: https://gossip-with-rails.herokuapp.com

List of Content:
1. Use Cases and Guide
2. Folder Structure
3. Cookies and Session Storage
4. Further Improvements

Use Cases:
1.	User 1 enters the website and is trying to find something interesting to read
	a.	He sees the homepage which contains a list of categories at the top, which he can use to filter out communities and topics related to the category. He can also sort the communities or topics by order of likes, as he thinks that the topics which has more likes on it is probably more interesting
	b.	The user comes across a topic he finds interesting and wants to continue reading further discussions on it later. He can choose to pin the topic itself or the entire category onto his sidebar so that he can easily access it whenever he wants to
2.	User 2 is trying to get advice on personal finances
	a.	User 2 can look for a community about finance and create topics within it regarding various different finance related matters.
	b.	User 2 creates topics to start discussions about insurance, saving plans and investments.
	c.	Eventually, other users come across the topics and leave comments to express their opinions. The site notifies the user that a comment has been left on his topic.
	d.	The user can continue to leave replies directly to comments and a discussion can continue this way
3.	User 3 recently got into ice skating and is trying to create an online community to share experiences and advice with each other.
	a.	The user creates a community under the ‘sports’ and ‘hobbies’ categories for ice skating.
	b.	Other users can start topics within the community and discuss or share opinions with other users through comments.
	c.	Any user can pin the community to their sidebar for easy access back to the community page.


Folder Structure:
/app
	/assets/stylesheets -> scss files can be found
	/controllers -> Application controller with JWT authorisation functions
		/api -> all controllers for backend can be found
	/javascript/packs -> All the jsx files for frontend can be found here
	/models -> All the models (database blueprint)
	/serializers -> Serializer files to help backend compile JSON back to frontend

Cookies and Session Storage:
User token is stored within cookies
Context is used to store pinned communities/topics as well as current shown community/topic
Context uses session storage to help maintain state when page refreshes

Further Improvements:
1. Allowing users to post images and videos along with their topics
2. Improving the notification system
  Currently the following actions will create a notification
  1. When someone posts a topic under your community
  2. When someone posts a comment under your topic
  3. When someone posts a reply under your comment
  The system could also take note of too many dislikes and edits being made to alert the user
