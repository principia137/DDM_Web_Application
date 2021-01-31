from django.urls import path
from ddm import views

app_name = 'ddm'

urlpatterns = [
    path('', views.home, name = 'home'),


    path('질문답변/', views.qna_list, name = 'qna'),
    path('질문답변/<int:question_id>/', views.qna_content, name = 'qna_content'),
    path('질문답변/answer/<int:question_id>/', views.qna_answer, name = 'qna_answer'),
    path('질문답변/question/', views.qna_question, name = 'qna_question'),
    path('질문답변/modify/<int:question_id>/', views.qna_modify, name='qna_modify'),


    path('자유게시판/', views.community_list, name = 'community'),
    path('자유게시판/<int:post_id>', views.community_content, name = 'community_content'),
    path('자유게시판/answer/<int:post_id>/', views.community_comment, name = 'community_comment'),
    path('자유게시판/question/', views.community_post, name = 'community_post'),


    path('진로정보/', views.info_list, name = 'info'),
    path('진로정보/<int:question_id>', views.info_content, name = 'info_content'),


    path('자료실/', views.lib_list, name = 'lib'),
    path('자료실/<int:library_id>', views.lib_content, name = 'lib_content'),
    path('자료실/upload/', views.lib_upload, name = 'lib_upload'),

    path('한글코딩/', views.calculater, name = 'calculater'),

]
