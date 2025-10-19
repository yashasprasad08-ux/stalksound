'use client'
import { useCallback, useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const URL_PATTERNS = [
  /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/i,
  /^(https?:\/\/)?(www\.)?youtube\.com\/.+|^(https?:\/\/)?(www\.)?youtu\.be\/.+/i,
  /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
]

export default function UrlInput({ onSubmit }: { onSubmit: (url: string) => void }) {
  const [url, setUrl] = useState('')
  const [valid, setValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = useCallback((value: string) => {
    return URL_PATTERNS.some((rx) => rx.test(value.trim()))
  }, [])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setUrl(v)
    setValid(v.length === 0 ? null : validate(v))
  }, [validate])

  const submit = useCallback(async () => {
    if (!validate(url)) {
      setValid(false)
      return
    }
    setLoading(true)
    try {
      onSubmit(url.trim())
    } finally {
      setLoading(false)
    }
  }, [onSubmit, url, validate])

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }, [submit])

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        placeholder="Paste a TikTok / YouTube / Instagram URL"
        value={url}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-invalid={valid === false}
        className={`${valid === false ? 'ring-2 ring-red-500' : ''}`}
      />
      <Button onClick={submit} disabled={loading} loading={loading}>
        Go
      </Button>
    </div>
  )
}
