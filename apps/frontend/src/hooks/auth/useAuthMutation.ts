import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { completeSignUp } from '@/apis/auth/auth';
import { SignupCompleteRequest } from '@homerunnie/shared';

export const useCompleteSignUpMutation = (
  options?: UseMutationOptions<unknown, Error, SignupCompleteRequest>,
) => {
  return useMutation({
    mutationFn: completeSignUp,
    ...options,
  });
};
