import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/apis/my/updateProfile';

export const useMyProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });
};
