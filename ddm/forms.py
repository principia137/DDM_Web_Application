from django.forms import ModelForm
from ddm.models import Question,Answer,Post,Comment,Library


class QuestionForm(ModelForm):
    class Meta:
        model = Question
        fields = ['subject', 'content']

class AnswerForm(ModelForm):
    class Meta:
        model = Answer
        fields = ['content']
        labels = {
            'content': '답변내용',
        }

class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ['subject', 'content']

class CommentForm(ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        labels = {
            'content': '답변내용',
        }

class LibraryForm(ModelForm):
    class Meta:
        model = Library
        fields = ['subject', 'content', 'files']