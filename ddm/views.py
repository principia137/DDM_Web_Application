from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from .models import Question,Answer,Post,Comment,Course_Question,Library
from django.utils import timezone
from .forms import QuestionForm, AnswerForm, PostForm, CommentForm, LibraryForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages

#Home
def home(request):
    return render(request, 'ddm/home.html')


#QnA
def qna_list(request):
    question_list = Question.objects.order_by('create_date')
    context = {'q_list': question_list}
    return render(request, 'ddm/q_list.html', context)

def qna_content(request,question_id):
    question_content = get_object_or_404(Question, pk=question_id)
    context = {'q_content': question_content}
    return render(request,'ddm/q_content.html',context)
@login_required(login_url='common:login')

def qna_answer(request, question_id):
    #question.answer_set.create(content=request.POST.get('content'), create_date=timezone.now())
    
    question = get_object_or_404(Question, pk=question_id)
    #answer = Answer(question=question, content=request.POST.get('content'), create_date=timezone.now())
    #answer.save()
    #context = {'a_list': answer}
    #return render(request,'ddm/a_list.html',context)
    if request.method == "POST":
        form = AnswerForm(request.POST)
        if form.is_valid():
            answer = form.save(commit=False)
            answer.author = request.user
            answer.create_date = timezone.now()
            answer.question = question
            answer.save()
            return redirect('ddm:qna_content', question_id=question.id)
    else:
        form = AnswerForm()
    context = {'question': question, 'form': form}
    return render(request, 'ddm/q_content.html', context)
@login_required(login_url='common:login')   

def qna_question(request):
    """
    질문등록
    """
    if request.method == 'POST':
        form = QuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.author = request.user
            question.create_date = timezone.now()
            question.save()
            return redirect('ddm:qna')
    else:
        form = QuestionForm()
    context = {'form': form}
    return render(request, 'ddm/q_form.html', context)

@login_required(login_url='common:login')
def qna_modify(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    if request.user != question.author:
        messages.error(request, '수정권한이 없습니다')
        return redirect('ddm:qna_content', question_id=question.id)

    if request.method == "POST":
        form = QuestionForm(request.POST, instance=question)
        if form.is_valid():
            question = form.save(commit=False)
            question.author = request.user
            question.modify_date = timezone.now()  # 수정일시 저장
            question.save()
            return redirect('ddm:qna_content', question_id=question.id)
    else:
        form = QuestionForm(instance=question)
    context = {'form': form}
    return render(request, 'ddm/q_form.html', context)


#Community
def community_list(request):
    post_list = Post.objects.order_by('create_date')
    context = {'p_list': post_list}
    return render(request, 'ddm/c_list.html', context)

def community_content(request,post_id):
    community_content = get_object_or_404(Post, pk=post_id)
    context = {'c_content': community_content}
    return render(request,'ddm/c_content.html',context)

def community_comment(request,post_id):
    post = get_object_or_404(Post, pk=post_id)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            answer = form.save(commit=False)
            answer.create_date = timezone.now()
            answer.question = post
            answer.save()
            return redirect('ddm:community_content', post_id=post.id)
    else:
        form = CommentForm()
    context = {'post': post, 'form': form}
    return render(request, 'ddm/c_content.html', context)

def community_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.create_date = timezone.now()
            post.save()
            return redirect('ddm:community')
    else:
        form = PostForm()
    context = {'form': form}
    return render(request, 'ddm/c_form.html', context)


#Information
def info_list(request):
    course_list = Course_Question.objects.order_by('create_date')
    context = {'c_list': course_list}
    return render(request, 'ddm/i_list.html', context)

def info_content(request,question_id):
    course_content = get_object_or_404(Course_Question, pk=question_id)
    context = {'i_content': course_content}
    return render(request,'ddm/i_content.html',context)


#Libraray
def lib_list(request):
    library_list = Library.objects.order_by()
    context = {'l_list': library_list}
    return render(request, 'ddm/l_list.html', context)

def lib_content(request,library_id):
    upload_content = get_object_or_404(Library, pk=library_id)
    context = {'l_content': upload_content}
    return render(request,'ddm/l_content.html',context)

def lib_upload(request):
    #Library.photo = request.FILES['photo']
    if request.method == 'POST':
        form = LibraryForm(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            return redirect('ddm:lib')
    else:
        form = LibraryForm()
    context = {'form': form}
    return render(request, 'ddm/l_form.html', context)

#한글코딩
def calculater(request):
    return render(request,'ddm/template_terminal.html')


#모델명,템플릿,템플릿 객체 이름 통일시키기

