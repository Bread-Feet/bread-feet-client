import { useState } from "react";
import { createBakeryUseCase } from "../../../../lib/usecases/bakery/createBakery.usecase";
import { updateBakeryUseCase } from "../../../../lib/usecases/bakery/updateBakery.usecase";

export default function useBakerySubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitCreate = async ({ draftBody, files }) => {
    setError(null);
    setIsSubmitting(true);
    try {
      return await createBakeryUseCase({ draftBody, files });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitUpdate = async ({ bakeryId, draftBody, files }) => {
    setError(null);
    setIsSubmitting(true);
    try {
      return await updateBakeryUseCase({ bakeryId, draftBody, files });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitCreate, submitUpdate, isSubmitting, error };
}
