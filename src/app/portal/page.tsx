import { redirect } from 'next/navigation';

// Preserve existing bookmarks while using the maintained account panel.
export default function AccountRedirect() {
  redirect('/?panel=account');
}
