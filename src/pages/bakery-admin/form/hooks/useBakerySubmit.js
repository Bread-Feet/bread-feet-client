import { useState } from "react";
import { createBakeryUseCase } from "../../../../lib/usecases/bakery/createBakery.usecase";

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

  // TODO
  // submitUpdate

  // return { submitCreate, submitUpdate, isSubmitting, error }
  return { submitCreate, isSubmitting, error };
}
