import { toForm } from '@/lib/utils';
import TranslatePostRequest from '@/types/request/TranslatePostRequest';
import { AxiosInstance } from 'axios';

export default async function postTranslatePost(
  axios: AxiosInstance,
  { id, content, ...rest }: TranslatePostRequest,
): Promise<void> {
  const form = toForm(rest);

  form.append('content', content.text);

  content.images.forEach(({ file, url }) => form.append('images', file, url));

  return axios.post(`/posts/${id}/translate`, form, {
    data: form,
  });
}
