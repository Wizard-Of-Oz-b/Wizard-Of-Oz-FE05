import React, { useEffect, useRef, useState } from 'react';
import { Shirt, AlertTriangle } from 'lucide-react';
import ModalShell from './components/ModalShell';
import useProductForm from './components/useProductForm';
import BasicInfo from './components/BasicInfo';
import GalleryInputs from './components/GalleryInputs';
import ColorsInputs from './components/ColorsInputs';
import SizesInputs from './components/SizesInputs';
import DetailsInputs from './components/DetailsInputs';
import MaterialCareInputs from './components/MaterialCareInputs';
import ConfirmModal from '../common/ConfirmModal';

import {
  uploadProductImages,
  listProductImages,
  fetchMainImageUrl,
} from '../../../api/admin/productImages';

import { buildOptionsFromForm } from '../../../api/admin/optionsMapper';

function normalizePrice(value) {
  if (value == null) return '';
  const s = String(value).replace(/[^\d.]/g, '');
  if (!s) return '';
  const parts = s.split('.');
  const cleaned =
    parts.length > 1 ? parts[0] + '.' + parts.slice(1).join('') : parts[0];
  return cleaned;
}
const isLikelyUrl = (v) => /^https?:\/\/\S+/i.test(String(v || '').trim());
const normUrl = (u) =>
  String(u || '')
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '');

export default function ProductFormModal({ open, onClose, onSave, initial }) {
  const { form, set, addRow, delRow, isEdit, reset } = useProductForm(initial);

  const [warnOpen, setWarnOpen] = useState(false);
  const [warnMsg, setWarnMsg] = useState('');
  const prefilledOnceRef = useRef(false);

  // 수정 모드에서 image_url 비어있으면 대표 이미지 1회 자동 세팅
  useEffect(() => {
    if (
      !open ||
      !isEdit ||
      !initial?.id ||
      prefilledOnceRef.current ||
      form.image_url
    )
      return;
    (async () => {
      try {
        const mainUrl = await fetchMainImageUrl(initial.id);
        if (mainUrl) set('image_url', mainUrl);
      } catch (e) {
        console.warn('대표 이미지 로드 실패:', e?.message || e);
      } finally {
        prefilledOnceRef.current = true;
      }
    })();
  }, [open, isEdit, initial?.id]); // set/form deps 제외 intentional

  // 모달 닫히면 폼 초기화
  useEffect(() => {
    if (!open) {
      prefilledOnceRef.current = false;
      reset();
    }
  }, [open, reset]);

  const fail = (msg) => {
    setWarnMsg(msg);
    setWarnOpen(true);
  };

  const submit = async () => {
    if (!form.name?.trim()) return fail('상품명을 입력하세요.');
    if (!form.category?.trim()) return fail('카테고리를 선택하세요.');
    const priceStr = normalizePrice(form.price);
    if (!(Number(priceStr) > 0)) return fail('가격을 확인하세요.');

    const payload = {
      id: form.id || undefined,
      name: form.name,
      price: priceStr,
      category: form.category,
      is_active: !!form.is_active,

      // ✅ options는 단 한 번만 — buildOptionsFromForm(form)
      options: buildOptionsFromForm(form),

      // 프론트 보조
      image_url: form.image_url || '',
      brand: form.brand || '',
      rating: Number(form.rating) || 0,
      ratingCount: Number(form.ratingCount) || 0,
      colors: form.colors,
      sizes: form.sizes,
      gallery: form.gallery,
      details: form.details,
      material: form.material,
      care: form.care,
      gender: form.gender,
      category_key: form.category_key,
    };

    try {
      const saved = await onSave?.(payload, isEdit);
      const productId = saved?.id || form.id;
      if (!productId) {
        onClose?.();
        return;
      }

      // 서버 이미지 목록 조회 → 중복 방지 업로드
      let existing = [];
      try {
        existing = await listProductImages(productId);
      } catch {}

      const existingSet = new Set(
        (existing || [])
          .map(
            (img) =>
              normUrl(img?.image_url) ||
              normUrl(img?.remote_url) ||
              normUrl(img?.file_url)
          )
          .filter(Boolean)
      );

      const wanted = [];
      if (isLikelyUrl(form.image_url)) wanted.push(form.image_url.trim());
      (form.gallery || []).forEach((g) => {
        if (isLikelyUrl(g)) wanted.push(String(g).trim());
      });

      const newUrls = wanted.filter((u) => !existingSet.has(normUrl(u)));

      if (newUrls.length > 0) {
        try {
          const uploaded = await uploadProductImages(productId, {
            image_urls: newUrls,
            save_remote: true,
            main_index: 0,
            replace_main: false, // 기존 대표 유지
            start_order: existing.length,
          });
          const main = uploaded.find((x) => x.is_main) || uploaded[0];
          if (main?.image_url) set('image_url', main.image_url);
        } catch (imgErr) {
          console.warn('이미지 업로드 실패:', imgErr?.message || imgErr);
        }
      }
    } finally {
      onClose?.();
    }
  };

  return (
    <>
      <ModalShell
        open={open}
        onClose={onClose}
        title={isEdit ? '상품 수정' : '새 상품 추가'}
        subtitle="기본 정보와 상세 콘텐츠를 입력하세요. (갤러리 최대 6장 권장)"
        icon={<Shirt className="size-5" />}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="h-11 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={submit}
              className="h-11 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-700"
            >
              저장
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <BasicInfo form={form} set={set} />
          <section className="lg:col-span-3 rounded-2xl border border-gray-100 p-5">
            <GalleryInputs
              form={form}
              set={set}
              addRow={addRow}
              delRow={delRow}
            />
            <ColorsInputs
              form={form}
              set={set}
              addRow={addRow}
              delRow={delRow}
            />
            <SizesInputs
              form={form}
              set={set}
              addRow={addRow}
              delRow={delRow}
            />
            <DetailsInputs
              form={form}
              set={set}
              addRow={addRow}
              delRow={delRow}
            />
            <MaterialCareInputs
              form={form}
              set={set}
              addRow={addRow}
              delRow={delRow}
            />
          </section>
        </div>
      </ModalShell>

      <ConfirmModal
        open={warnOpen}
        onClose={() => setWarnOpen(false)}
        onConfirm={() => setWarnOpen(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="size-5" />
            <span>안내</span>
          </div>
        }
        message={warnMsg}
        confirmText="확인"
        showCancel={false}
      />
    </>
  );
}
