# Backend 구축 계획서 (University Student Dashboard)

본 문서는 프론트엔드 분석 결과를 바탕으로 한 백엔드 시스템 구축 계획입니다.

## 1. 기술 스택 (Tech Stack)
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript 권장)
- **Database**: PostgreSQL (Prisma ORM 사용 권장 - 관계형 데이터 처리에 용이)
- **Authentication**: JWT (JSON Web Token) & bcrypt (비밀번호 암호화)
- **Validation**: Zod (데이터 스키마 검증)
- **Documentation**: Swagger (API 문서화)

## 2. 데이터베이스 모델링 (Database Schema)

### User (사용자)
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `nickname`: String
- `avatarColor`: String (프론트엔드 아바타 배경색)
- `role`: Enum (STUDENT, ADMIN)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Post (게시글)
- `id`: Int (Primary Key)
- `title`: String
- `content`: Text
- `category`: String (자유, 질문, 정보, 스터디, 프로젝트 등)
- `type`: Enum (NOTICE, COMMUNITY)
- `authorId`: UUID (Foreign Key -> User.id)
- `viewCount`: Int (Default: 0)
- `likeCount`: Int (Default: 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Comment (댓글)
- `id`: Int (Primary Key)
- `content`: Text
- `postId`: Int (Foreign Key -> Post.id)
- `authorId`: UUID (Foreign Key -> User.id)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### DailyKnowledge (오늘의 지식)
- `id`: Int (Primary Key)
- `keyword`: String
- `title`: String
- `description`: String
- `content`: Text
- `date`: Date (Unique)

### Menu (식단)
- `id`: Int (Primary Key)
- `date`: Date
- `mealType`: Enum (LUNCH, DINNER)
- `items`: String[] (식단 리스트)

### Event (일정/D-Day)
- `id`: Int (Primary Key)
- `title`: String
- `date`: Date
- `time`: String (HH:mm)
- `color`: String (Hex 또는 CSS 클래스)
- `type`: Enum (ACADEMIC, PROJECT, PERSONAL)

## 3. 주요 API 엔드포인트 (API Endpoints)

### Auth (인증)
- `POST /api/auth/signup`: 회원가입
- `POST /api/auth/login`: 로그인
- `GET /api/auth/me`: 내 정보 확인 (토큰 검증)

### Notice & Community (게시판)
- `GET /api/posts?type={NOTICE|COMMUNITY}`: 게시글 목록 조회 (페이지네이션 포함)
- `GET /api/posts/:id`: 게시글 상세 조회
- `POST /api/posts`: 게시글 작성 (인증 필요)
- `PATCH /api/posts/:id`: 게시글 수정
- `DELETE /api/posts/:id`: 게시글 삭제

### Dashboard & Misc
- `GET /api/knowledge/today`: 오늘의 지식 조회
- `GET /api/menu/today`: 오늘의 식단 조회
- `GET /api/events/dday`: 가장 가까운 D-Day 일정 조회

## 4. 단계별 구축 로직

1.  **환경 설정**: Node.js 프로젝트 초기화 및 TypeScript, Prisma 설정.
2.  **인증 시스템**: JWT 기반의 로그인/회원가입 로직 구현.
3.  **게시판 CRUD**: 공지사항 및 커뮤니티 게시글 관리 기능 구현.
4.  **데이터 수집/제공**: 식단 및 오늘의 지식 데이터를 위한 API 및 DB 초기화 스크립트 작성.
5.  **프론트엔드 연동**: Axios 등을 사용하여 프론트엔드의 Mock 데이터를 실제 API로 교체.

## 5. 추가 고려 사항
- **이미지 업로드**: 게시글 내 이미지 첨부를 위한 S3 또는 로컬 스토리지 연동.
- **실시간 알림**: 새로운 공지사항 발생 시 알림 기능 (선택 사항).
- **보안**: CORS 설정 및 Helmet.js 등을 통한 기본적인 보안 강화.
