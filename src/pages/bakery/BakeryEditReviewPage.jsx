import styled from "styled-components";
const left_arrow = "/arrow_left_black.svg";
const PlusIcon = "/plus.svg";
const star = "/starIcon.svg";

import PageLayout from "../../components/layout/PageLayout";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { uploadReviewPhoto } from "../../lib/api/imgUpload";
import { updateReview } from "../../lib/api/review";

const MAX_LEN = 299;
const MAX_PHOTOS = 5;

export default function BakeryEditReviewPage() {
  const nav = useNavigate();
  const { id: bakeryId, reviewId } = useParams();
  const { state } = useLocation();
  const review = state?.review;
  const resolvedReviewId = review?.id ?? Number(reviewId);

  const [text, setText] = useState(review?.content ?? "");
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [existingPhotos, setExistingPhotos] = useState(review?.photos ?? []); // 湲곗〈 S3 URL
  const [newPhotos, setNewPhotos] = useState([]); // { file, previewUrl }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef(null);
  const newPhotosRef = useRef(newPhotos);
  newPhotosRef.current = newPhotos;

  const totalCount = existingPhotos.length + newPhotos.length;

  useEffect(() => {
    return () => {
      newPhotosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  useEffect(() => {
    if (!review?.id && !reviewId) {
      nav(bakeryId ? `/bakery/${bakeryId}` : "/bakery", { replace: true });
    }
  }, [review?.id, reviewId, bakeryId, nav]);

  const openFilePicker = () => {
    if (totalCount >= MAX_PHOTOS) return;
    fileRef.current?.click();
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - totalCount;
    const toAdd = files.slice(0, remaining);
    const newItems = toAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setNewPhotos((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const removeExisting = (idx) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx) => {
    setNewPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    if (!resolvedReviewId) {
      nav(bakeryId ? `/bakery/${bakeryId}` : "/bakery", { replace: true });
      return;
    }
    if (!text.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedUrls = await Promise.all(
        newPhotos.map((p) => uploadReviewPhoto({ file: p.file })),
      );
      const reviewPictureUrls = [...existingPhotos, ...uploadedUrls];
      await updateReview({
        reviewId: resolvedReviewId,
        content: text,
        rating,
        reviewPictureUrls,
      });
      nav(-1);
    } catch (err) {
      alert(err.message || "리뷰 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <TopBar>
        <BackBtn type="button" onClick={() => nav(-1)} aria-label="뒤로가기">
          <Arrow src={left_arrow} />
        </BackBtn>
        <Title>리뷰 수정하기</Title>
        <RightSpace />
      </TopBar>

      <ReviewWrapper>
        <Body>
          <StarRatingInput rating={rating} onChange={setRating} />

          <TextAreaCard>
            <TextArea
              maxLength={MAX_LEN}
              placeholder="리뷰를 작성해주세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </TextAreaCard>
          <Counter>
            {text.length} / {MAX_LEN}
          </Counter>

          <PhotoRow>
            <PhotoInputBox
              onClick={openFilePicker}
              disabled={totalCount >= MAX_PHOTOS}
            >
              <PlusImg src={PlusIcon} />
            </PhotoInputBox>
            <PhotoInput
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
            />
            <PhotoWrapper>
              {existingPhotos.map((url, i) => (
                <PhotoBox
                  key={`existing-${i}-${url}`}
                  type="button"
                  onClick={() => removeExisting(i)}
                  aria-label="사진 삭제"
                >
                  <PreviewImg src={url} alt="" />
                  <DeleteBadge aria-hidden="true">×</DeleteBadge>
                </PhotoBox>
              ))}
              {newPhotos.map((p, i) => (
                <PhotoBox
                  key={p.previewUrl}
                  type="button"
                  onClick={() => removeNew(i)}
                  aria-label="사진 삭제"
                >
                  <PreviewImg src={p.previewUrl} alt="" />
                  <DeleteBadge aria-hidden="true">×</DeleteBadge>
                </PhotoBox>
              ))}
              {Array.from({ length: MAX_PHOTOS - totalCount }).map((_, i) => (
                <EmptyPhotoBox key={`empty-${i}`} />
              ))}
            </PhotoWrapper>
          </PhotoRow>
        </Body>
      </ReviewWrapper>

      <BottomBar>
        <SubmitBtn type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "수정 중..." : "완료"}
        </SubmitBtn>
      </BottomBar>
    </PageLayout>
  );
}

function StarRatingInput({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;

  return (
    <StarRow>
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        return (
          <StarBtn
            key={i}
            type="button"
            aria-label={`별점 ${value}점`}
            onClick={() => onChange(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
          >
            <StarIcon src={star} alt="" $dim={value > display} />
          </StarBtn>
        );
      })}
    </StarRow>
  );
}

const ReviewWrapper = styled.div`
  width: 100%;
  flex: 1;

  padding: 16px;
`;

const TopBar = styled.header`
  width: 100%;

  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  background: transparent;

  padding: 53px var(--page-padding) 10px var(--page-padding);
`;

const BackBtn = styled.button`
  border: 0;
  background: transparent;
  border-radius: 10px;
  display: grid;
  justify-content: center;
  place-items: center;

  padding: 5px;

  cursor: pointer;
`;

const Arrow = styled.img`
  width: 36px;
  height: 36px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #000000;

  text-align: center;

  margin: 0;
`;

const RightSpace = styled.div``;

const Body = styled.div`
  width: 100%;
`;

const StarRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  margin-bottom: 16px;
`;

const StarBtn = styled.button`
  border: 0;
  background: transparent;
  padding: 4px;
  cursor: pointer;
`;

const StarIcon = styled.img`
  width: 32px;
  height: 32px;
  opacity: ${(p) => (p.$dim ? 0.25 : 1)};
  transition: opacity 0.1s;
`;

const TextAreaCard = styled.div`
  height: 360px;

  border: 1px solid #e8ebf1;
  border-radius: 20px;
  background: #f8f9fa;

  padding: 24px;
`;

const TextArea = styled.textarea`
  font-size: 16px;
  line-height: 20px;
  color: #000000;

  width: 100%;
  height: 100%;

  resize: none;
  border: 0;
  outline: 0;
  background: transparent;

  padding: 0;

  &::placeholder {
    color: #b9b9b9;
  }
`;

const Counter = styled.div`
  font-size: 16px;
  color: #a5a5a5;
  text-align: right;

  margin: 8px 0;
`;

const PhotoRow = styled.div`
  height: 135px;

  display: grid;
  grid-template-columns: 135px 1fr;
  gap: 8px;
`;

const PhotoInput = styled.input`
  display: none;

  cursor: pointer;
`;

const PhotoInputBox = styled.button`
  width: 135px;
  height: 135px;

  border: solid 1px #e8ebf1;
  border-radius: 20px;
  background: #f8f9fa;

  padding: 0;

  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const PlusImg = styled.img``;

const PhotoWrapper = styled.div`
  min-width: 0;

  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
`;

const PhotoBox = styled.button`
  flex: 0 0 120px;
  width: 120px;
  height: 135px;

  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;

  border: 1px solid #e9e9e9;
  border-radius: 20px;
  background: #fff;

  padding: 0;
  cursor: pointer;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteBadge = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;

  width: 20px;
  height: 20px;
  border-radius: 999px;

  display: grid;
  place-items: center;

  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 14px;
  line-height: 1;
`;

const EmptyPhotoBox = styled.div`
  flex: 0 0 120px;
  width: 120px;
  height: 135px;

  border: 1px solid #e9e9e9;
  border-radius: 20px;
  background: #fff;
`;

const BottomBar = styled.div`
  width: 100%;

  padding: 0 16px 24px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
`;

const SubmitBtn = styled.button`
  font-size: 16px;
  font-weight: 600;

  width: 100%;
  color: var(--main-color4);

  border: 0;
  border-radius: 20px;
  background: var(--main-color2);

  padding: 15px 0;

  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
