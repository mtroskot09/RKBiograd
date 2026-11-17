import { z } from "zod";

// Croatian texts for form validation errors (admin forms). Messages written directly in a
// schema (e.g. "Kraj mora biti nakon početka") still take precedence.
z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined" || issue.received === "null") return { message: "Obavezno polje" };
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return { message: issue.minimum === 1 ? "Obavezno polje" : `Najmanje ${issue.minimum} znakova` };
      }
      if (issue.type === "array") return { message: `Najmanje ${issue.minimum} stavki` };
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === "string") return { message: `Najviše ${issue.maximum} znakova` };
      if (issue.type === "array") return { message: `Najviše ${issue.maximum} stavki` };
      break;
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") return { message: "Neispravna e-mail adresa" };
      return { message: "Neispravan unos" };
    case z.ZodIssueCode.invalid_date:
      return { message: "Neispravan datum" };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: "Odaberite jednu od ponuđenih vrijednosti" };
  }
  return { message: ctx.defaultError };
});
