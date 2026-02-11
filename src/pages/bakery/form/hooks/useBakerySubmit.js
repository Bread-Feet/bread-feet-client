import { useState } from "react";
import { submitBakeryForm } from "../../../../lib/api/bakery-form";
import { validateBakeryBody } from "../utils/makeBakeryBody";

export default function useBakerySubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitCreate = async (body) => {
    setError(null);
    setIsSubmitting(true);
    try {
      validateBakeryBody(body);
      return await submitBakeryForm(body);
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
