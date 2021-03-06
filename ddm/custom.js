// 출력값은 custom.output
// 오류는 custom.return


// 커스텀 변수 객체
var custom = {output:'', return:0};
// 사용법 >> custom[name] = value;    i.e.  custom[변수명] = 값;


// 변수들 출력하는 함수. 나중에 출력 방식을 변경
custom.print = function(var_name) {
  this.output += `${var_name} : ${custom[var_name]}
`;    // \n 표현
}
  

 // 에러함수 정의
function process_error(error_code) {
  custom.return =  `오류!! 『 ${error_code} 』에 오류가 있습니다.`;
}


// 변수인지 숫자인지 구분해서 그 값을 return하는 함수.
function check_var(err, input){
  if (input===undefined) {   // 명령어에서 더할 수를 안주었으면 에러
    process_error(err);    // 연산자에 오류 표시
    return 0;
  } else if (custom[input]===undefined) {    // 명령어에서 받아온 두번째 값이 저장된 변수가 아니라면,
    if (Number(input)===NaN) {                // 근데 숫자도 아니라면 에러
      process_error(input);  // 해당 변수명에 에러 표시
    } else {    // 숫자라면
      return Number(input);  // 해당 숫자 값을 이용.
    }
  } else {    // 저장된 변수가 맞다면
    return Number(custom[input]);
  }
}


// 사칙연산 함수
function calculations(operator, result ,num1, num2) {
  num1 = check_var(operator, num1);   // 변수면 변수값, 숫자면 숫자
  num2 = check_var(operator, num2);   // 변수면 변수값, 숫자면 숫자
  switch (operator) { // 사칙연산 구분  ,  코드의 가독성을 위해 이렇게 해야겠음.
    case '더하기':
      // 변수에 저장
      custom[result] = num1 + num2;
      break;
    case '빼기':
      custom[result] = num1 - num2;
      break;
    case '곱하기':
      custom[result] = num1 * num2;
      break;
    case '나누기':
      custom[result] = num1 / num2;
      break;
  }
  custom.draft = custom[result];  // 드래프트에 저장
}

//명령 수행을 함수로 만듦. 언제든 재사용이 가능하도록!                                    현재는  ; 에서 , 로 업데이트 했다.
custom.process_command = function(input) {  // input에 코드 string 입력.       e.g. input = [ 홍길동은     테   스  트   ;     물방울은   촉촉;     ]
  // 명령어 객체 생성
  let command = {   // 반복문을 위해 블록 범위 변수로 설정.
    wild: "",     // 초기 유저에게 받아온 값.
    codes: {
      // 변수를 위한 프로퍼티
      space:[],       //  쉼표(,)로만 구분
      space_value:'', // 변수 값
      // 명령어를 위한 프로퍼티
      one:[],     //  한 줄의 명령어              i.e. run nano
      words:[],   //  단어별로 쪼갬.              i.e. [run,nano]
      core:""     //  명령어 핵심부분 : words[0]  i.e. run
    },
    repeat : {
      start : {},
      end : {},
      times : {}
    }
  };
  // 명령어 조사하기 :: 나중에 수정할 것 > 명령어도 파일로 만들어서 관리
  // space는 변수를 위해 생성하는 것.  즉 띄어쓰기 여러개를 살려야한다. 그래서 쉼표(,) 구분만 할 것.
  command.codes.space = input.split(",");   //                          e.g. space[] = [ 홍길동은     테   스  트   ,     물방울은   촉촉,     ]
  // one이 명령어 설정. 띄어쓰기 여러 개 인것을 제거.
  command.codes.one = input.replace(/ +/g," ");    //                   e.g. one = [ 홍길동은 테 스 트 ; 물방울은 촉촉; ]
  // one 앞뒤 공백 제거 trim
  command.codes.one = command.codes.one.trim();     //                  e.g. one = [홍길동은 테 스 트 ; 물방울은 촉촉;]
  // 쉼표(,)로 구분하기
  command.codes.one = command.codes.one.split(','); //                  e.g. one[] = [홍길동은 테 스 트 , 물방울은 촉촉,]
  // 만약 배열의 마지막 값이 공백인 경우, 제거해버림.
  if (command.codes.one[command.codes.one.length-1].replace(/ /g,"")==="") {command.codes.one.pop();} // e.g. one[] = [홍길동은 테 스 트 , 물방울은 촉촉]
  // 각각의 명령어들을 수행함.
  for(var key in command.codes.one) {       //                         e.g. one[key] = [홍길동은 테 스 트 ]
    // 명령어 앞과 input값 뒤의 띄어쓰기 제거.
    command.codes.one[key] = command.codes.one[key].trim();       //   e.g. one[key] = [홍길동은 테 스 트]
    // 명령어와 input값을 구분함.
    command.codes.words = command.codes.one[key].split(" ");      //   e.g. words[] = [홍길동은,테,스,트]
    // 명령어만 따로 이름 부여. == core
    command.codes.core = command.codes.words[0];                  //   e.g. core = [홍길동은]
    // 명령어 스위치구문.. 어떤 명령인지 구분함.  관리자코드와 유저코드로 구분.

// 여기부터 유저 코드 ( 계산기 )

      // 만약 명령어 마지막 글자가 [은/는]일 경우 >> 변수와 연관    :: 이 복잡한 과정은 오직 다음을 위함.   > [ 홍길동은     테   스  트   ]
    if (command.codes.core[command.codes.core.length-1]==='은' || command.codes.core[command.codes.core.length-1]==='는' ) {
      command.codes.core = command.codes.core.substr(0, command.codes.core.length-1);  // '은' 또는 '는' 제거      e.g. core = [홍길동]
      // 명령이 변수 설정인지 연산인지 구분.
      if (command.codes.words[2]==='더하기' || command.codes.words[2]==='빼기' || command.codes.words[2]==='곱하기' || command.codes.words[2]==='나누기') {
        // 명령어가 연산인 경우.
        calculations(command.codes.words[2], command.codes.core, command.codes.words[1], command.codes.words[3]);   // 사칙연산 계산.
      } else if (command.codes.words[2]==='이어' || command.codes.words[2]==='띄고') { // 문자열 잇기
        if (custom[command.codes.words[1]]===undefined) {process_error(command.codes.words[1]);} // 이을 첫번째 변수가 존재하지 않을 경우 에러
        if (custom[command.codes.words[3]]===undefined) {process_error(command.codes.words[3]);} // 이을 두번째 변수가 존재하지 않을 경우 에러
        if (command.codes.words[2]==='이어') {
          custom[command.codes.core] = custom[command.codes.words[1]] + custom[command.codes.words[3]];     // 문자 이어서 저장.
        } else {
          custom[command.codes.core] = custom[command.codes.words[1]] + ' ' + custom[command.codes.words[3]];     // 문자 띄어서 저장.
        }
        custom.draft = custom[command.codes.core];  // 드래프트에도 저장
      } else if (false) { // 지수
      } else {   // 명령어가 변수설정인 경우
        // 띄어쓰기로 구분하기 전 코드 가져옴                                                                         e.g. space[key] = [ 홍길동은     테   스  트   ]
        // 그러고 trim. 앞뒤 공백 제거
        command.codes.space_value = command.codes.space[key].trim();  //                                            e.g. space_value = [홍길동은     테   스  트]
        // 변수명 제거
        command.codes.space_value = command.codes.space_value.substr(command.codes.core.length+1)  //               e.g. space_value = [     테   스  트]
        // 다시 trim
        command.codes.space_value = command.codes.space_value.trim(); //                                            e.g. space_value = [테   스  트]
        // 변수 값이 없을 경우 자동으로 '값이 없음' 대입.
        if (command.codes.space_value === undefined || command.codes.space_value === '') {command.codes.space_value = '값이 없음'};
        // 커스텀 객체에 프로퍼티로 삽입.                                                                             e.g. custom = { '홍길동' : '테   스  트' }
        custom[command.codes.core] = command.codes.space_value;
        custom.draft = custom[command.codes.core]; // 임시변수에도 저장  변수명+'도'를 위해서
      }
      //  [ 은 / 는 ] CASE END
  // ===================================================================
    } else if (command.codes.core[command.codes.core.length-1]==='도') {  // 명령어 마지막 글자가 [도]인 경우.
      command.codes.core = command.codes.core.substr(0, command.codes.core.length-1); // '도' 제거
      custom[command.codes.core] = custom.draft;  // 이전 값 대입
    } else if (command.codes.core === '여기부터') { // 반복문의 시작
      if (command.codes.words[1] === undefined) { command.codes.words[1] = 'default'; } // 반복문의 이름을 지정하지 않았다면 자동으로 default에 저장.
      if (command.codes.words[1] === '시작') { command.codes.words[1] = '반복';}
      command.repeat.start[command.codes.words[1]] = key; // 반복문의 이름에 시작위치 지정.
    } else if (command.codes.core === '여기까지') { // 반복문의 종료
      if (command.codes.words[2] === undefined) { command.codes.words[2] = 'default'; }  // 반복문의 이름을 지정하지 않았다면 자동으로 default에 저장
        command.repeat.end[command.codes.words[2]] = key; // 반복문의 이름에 종료위치 지정.
      if (command.codes.words[1].substr(-1)==='번') { // 몇번 이라고 명령한 경우
        command.codes.words[1] = command.codes.words[1].substr(0, command.codes.words[1].length-1);   //  '번' 제거
      } else if (command.codes.words[1].substr(-2)==='만큼') { // 몇만큼 이라고 명령한 경우
        command.codes.words[1] = command.codes.words[1].substr(0, command.codes.words[1].length-2);   //  '만큼' 제거
      } else {process_error(command.codes.words[1]);} // 그 외 '번'도 아니고 '만큼'도 아니면 에러.
      command.repeat.times[command.codes.words[2]] = check_var(command.codes.core, command.codes.words[1]); // 반복횟수 결정.
      command.repeat.times[command.codes.words[2]] -= 1;  // 일단 시작할 때 한번 실행하니까 한번 빼줌.
      // 문자열 합치기 (반복 범위만큼)
      var command_draft = ''; // 반복할 명령어 문자열로 담을 곳 생성
      if (command.repeat.start[command.codes.words[2]] === undefined) { process_error('반복문의 이름'); }
      command.repeat.start[command.codes.words[2]] = Number(command.repeat.start[command.codes.words[2]]) + 1;  // 시작 위치에 1 추가 (여기부터 코드는 빼기 위함.)
      // slice()는 start 위치를 포함해서 자름. but end 위치는 미포함. 그래서 start만 1만큼 더해주는 것.
      var command_array = command.codes.one.slice(command.repeat.start[command.codes.words[2]], command.repeat.end[command.codes.words[2]]); // 반복할 명령어 생성 (배열 상태)
      command_draft = command_draft.concat(command_array);    // 문자열로 변경
      for (let i=1; i<=command.repeat.times[command.codes.words[2]]; i++) {   // 반복 시작. 반복 횟수만큼
        this.process_command(command_draft);  // 명령어를 다시 보냄.
      }
    } else if (command.codes.core[command.codes.core.length-1]==='에') { // 명령어 마지막 글자가 [에] 라면
      command.codes.core = command.codes.core.substr(0, command.codes.core.length-1); // '에' 제거
      calculations(command.codes.words[2], command.codes.core, command.codes.core, command.codes.words[1]);   // 사칙연산
    } else if (command.codes.core.substr(command.codes.core.length-2)==='에서') { // 명령어 마지막 글자가 [에서] 라면
      command.codes.core = command.codes.core.substr(0, command.codes.core.length-2); // '에서' 제거
      calculations(command.codes.words[2], command.codes.core, command.codes.core, command.codes.words[1]);   // 사칙연산
    } else if (command.codes.core[command.codes.core.length-1]==='을' || command.codes.core[command.codes.core.length-1]==='를') { // 명령어 마지막 글자가 [을/를] 이라면
      command.codes.core = command.codes.core.substr(0, command.codes.core.length-1); // '을' / '를' 제거
      if (command.codes.words[1].substr(command.codes.words[1].length-2)==='으로') {  // 변수명 마지막 글자가 [으로] 라면
        command.codes.words[1] = command.codes.words[1].substr(0, command.codes.words[1].length-2); // '으로' 제거
        calculations(command.codes.words[2], command.codes.core, command.codes.core, command.codes.words[1]);   // 사칙연산
      } else if (command.codes.words[1][command.codes.words[1].length-1]==='로') { // 변수명 마지막 글자가 [로] 라면
        command.codes.words[1] = command.codes.words[1].substr(0, command.codes.words[1].length-1); // '로' 제거
        calculations(command.codes.words[2], command.codes.core, command.codes.core, command.codes.words[1]);   // 사칙연산
      } else {
        process_error(command.codes.words[1]);
      }
    } else if (command.codes.core[command.codes.core.length-1]==='이' || command.codes.core[command.codes.core.length-1]==='가') { // 명령어 마지막 글자가 [이/가] 라면
      command.codes.core = command.codes.core.substr(0, command.codes.core.length-1); // '이/가' 제거
      // 조건문 만들어야함.
      // 일단은 에러
      process_error(command.codes.core);  // 명령어에 오류가 있음.
    } else if (false) { // 명령어 추가

    } 
    // ============================================== SECOND CORE =============================================================
      else if (command.codes.words[1]==='보기') {   // 보기 명령어가 들어온다면.
      if (custom[command.codes.core]===undefined){  // 볼 변수 이름이 없다면
        process_error(command.codes.core);          // 에러
      } else {
        custom.print(command.codes.core);   // 변수 출력
      }
    } else if (command.codes.words[1]==='더하기' || command.codes.words[1]==='빼기' || command.codes.words[1]==='곱하기' || command.codes.words[1]==='나누기') { // 사칙연산 명령어인 경우
      if (command.codes.words[3]===undefined) {   // 그냥 self 계산인 경우. 즉 core 자체에 저장하는 경우
        calculations(command.codes.words[1], command.codes.core, command.codes.core, command.codes.words[2]);   // 사칙연산 계산.
      } else if (command.codes.words[3]==='보기') {  // 저장 안하고 바로 출력하는 경우
        var draft_val = ''; // 임시저장소 생성
        draft_val = draft_val.concat(command.codes.words[0],' ',command.codes.words[1],' ',command.codes.words[2]);   // 합치기
        calculations(command.codes.words[1], draft_val, command.codes.core, command.codes.words[2]); // 임시 변수에 저장
        custom.print(draft_val);   // 임시 변수 출력
      } else {  // 다른 변수에 저장하는 경우,
        if (command.codes.words[2][command.codes.words[2].length-1]==='은' || command.codes.words[2][command.codes.words[2].length-1]==='는') {  // i.e.  A 더하기 B는 C
          command.codes.words[2] = command.codes.words[2].substr(0, command.codes.words[2].length-1);  // '은' 또는 '는' 제거
        }  // 은,는 안붙이면 에러. 에휴 한번 봐준다
        calculations(command.codes.words[1], command.codes.words[3], command.codes.core, command.codes.words[2]);   // 사칙연산 계산.
      }  
    } else if (false) { // 명령어 추가
    } else {  // 알 수 없는 코드
      // 봐주는 것 구분
      if (command.codes.core === undefined || command.codes.core === '') { // 쉼표 잘못써서 공백코드가 들어온 정도는 봐주겠다. 
      } else {  // 문법에 오류가 있으면!
        process_error(command.codes.core);  // 명령어에 오류가 있음.
        return 1;
      }
    }
  } // for end
} // function end
