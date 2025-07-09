// Import necessary hooks and libraries
import { useState, useEffect, useMemo } from "react";
import { z, ZodRawShape, ZodString } from "zod";
import { useSubmitForm } from "@/hooks/submitForm.hook";
import { useCmsModule } from "@/hooks/useCmsModule.hooks";

// Field interface defines the structure for each form field
interface Field {
  type: string;
  name: string;
  label: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  styling?: {
    className?: string;
    placeholder?: string;
  };
}

// Submission interface defines the structure for form submission settings
interface Submission {
  endpoint: string;
  method: string;
  successMessage: string;
  errorMessage: string;
}

// ContactFormAttributes interface groups fields and submission settings
interface ContactFormAttributes {
  fields: Field[];
  submission: Submission;
}

// Main ContactForm component
const ContactForm = ({ id }: { id: string }) => {
  // Fetch CMS module data for the given form id
  const cmsModule = useCmsModule(id);
  // Custom hook to handle form submission
  const { submitForm } = useSubmitForm();
  let fields: Field[] = [];
  let submission: Submission = {
    endpoint: "",
    method: "POST",
    successMessage: "",
    errorMessage: "",
  };
  // Extract fields and submission settings if the module is a form
  if (cmsModule && cmsModule.type === "form") {
    const attrs = cmsModule as { attributes: ContactFormAttributes };
    fields = attrs.attributes.fields;
    submission = attrs.attributes.submission;
  }

  // Build Zod schema for client-side validation based on field definitions
  const { validators, formSchema } = useMemo(() => {
    const schemaShape: ZodRawShape = {};
    const validators: Record<string, ZodString> = {};
    fields.forEach((field) => {
      let validator: ZodString = z.string();
      // Always require all fields
      validator = validator.min(1, { message: `${field.label} is required` });
      if (field.validation?.minLength) {
        validator = validator.min(field.validation.minLength, {
          message: `${field.label} must be at least ${field.validation.minLength} characters`,
        });
      }
      if (field.validation?.maxLength) {
        validator = validator.max(field.validation.maxLength, {
          message: `${field.label} must be at most ${field.validation.maxLength} characters`,
        });
      }
      if (field.validation?.pattern) {
        validator = validator.regex(new RegExp(field.validation.pattern), {
          message: `${field.label} is invalid`,
        });
      }
      if (field.type === "email") {
        validator = validator.email({
          message: "Please provide a valid email address",
        });
      }
      schemaShape[field.name] = validator;
      validators[field.name] = validator;
    });
    return { validators, formSchema: z.object(schemaShape) };
  }, [fields]);

  // State for form data, success/error messages, loading, and field errors
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset formData and fieldErrors when fields change (e.g., after CMS loads)
  useEffect(() => {
    setFormData(
      fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    );
    setFieldErrors({});
  }, [fields]);

  // Effect to auto-hide the success message after 5 seconds
  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => setSuccess(""), 5000);
    return () => clearTimeout(timeout);
  }, [success]);

  // If the CMS module is not a form or fields are not loaded, render a loading indicator
  if (!cmsModule || cmsModule.type !== "form" || fields.length === 0) {
    return (
      <div className="py-16 px-4 text-center text-gray-500">
        Loading form...
      </div>
    );
  }

  // Handle input changes and clear field errors on change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[e.target.name];
        return updated;
      });
    }
    if (success) setSuccess("");
  };

  // Handle form submission, including client-side validation and API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prevent submission if fields are not loaded
    if (fields.length === 0) return;
    setLoading(true);
    setSuccess("");
    setError("");
    setFieldErrors({});
    // Client-side validation with Zod
    const parseResult = formSchema.safeParse(formData);
    if (!parseResult.success) {
      const zodErrors: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          zodErrors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(zodErrors);
      setLoading(false);
      return;
    }
    try {
      // Submit form data to the backend
      const result = await submitForm({
        endpoint: submission.endpoint,
        method: submission.method,
        data: formData,
      });
      if (result.success) {
        setSuccess(submission.successMessage);
        setFormData(
          fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
        );
      } else if (result.errors) {
        setFieldErrors(result.errors);
        setError(result.error || submission.errorMessage);
      } else {
        setError(result.error || submission.errorMessage);
      }
    } catch {
      setError(submission.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Validate a single field on blur and update field errors
  const validateField = (name: string, value: string) => {
    const validator = validators[name];
    if (!validator) return;
    const result = validator.safeParse(value);
    if (result.success) {
      setFieldErrors((prev) => {
        if (!prev[name]) return prev;
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: result.error.errors[0]?.message || "Invalid value",
      }));
    }
  };

  // Render the contact form UI
  return (
    <section id="contact-form" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="bg-gray-50 p-8 rounded-lg shadow-md"
        >
          {/* Render each field dynamically based on the fields array */}
          {fields.map((field) => (
            <div className="mb-6" key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-gray-700 font-medium mb-2"
              >
                {field.label}
              </label>
              {/* Render input for text or email fields */}
              {field.type === "text" || field.type === "email" ? (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onBlur={(e) => validateField(field.name, e.target.value)}
                  minLength={field.validation?.minLength}
                  maxLength={field.validation?.maxLength}
                  pattern={field.validation?.pattern}
                  placeholder={field.styling?.placeholder}
                  className={`block form-input mb-2  w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    field.styling?.className || ""
                  } ${fieldErrors[field.name] ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              ) : null}
              {/* Render textarea for textarea fields */}
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onBlur={(e) => validateField(field.name, e.target.value)}
                  rows={4}
                  minLength={field.validation?.minLength}
                  maxLength={field.validation?.maxLength}
                  placeholder={field.styling?.placeholder}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    field.styling?.className || ""
                  } ${fieldErrors[field.name] ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              ) : null}
              {/* Display field-specific error message */}
              {fieldErrors[field.name] && (
                <div className="mt-2 min-h-[1.5rem] text-sm text-red-600">
                  {fieldErrors[field.name]}
                </div>
              )}
            </div>
          ))}
          {/* Submit button with loading spinner */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                style={{ marginRight: "0.5rem" }}
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
        {/* Display success or error messages */}
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactForm;

// Export types for use elsewhere
export type { Field, Submission };
