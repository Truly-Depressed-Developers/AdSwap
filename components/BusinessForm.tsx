'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { trpc } from '@/trpc/client';
import { TagDTO } from '@/types/dtos';
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from './ui/combobox';
import dynamic from 'next/dynamic';
import { Drawer } from 'vaul';
import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { InputGroup, InputGroupButton, InputGroupInput } from './ui/input-group';
import { cn } from '@/lib/utils';

const MapPicker = dynamic(() => import('./ui/map-picker'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />,
});

const businessFormSchema = z.object({
  nip: z.string().length(10, 'NIP musi mieć dokładnie 10 cyfr'),
  name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
  address: z.string().min(5, 'Adres musi mieć co najmniej 5 znaków'),
  description: z.string().min(10, 'Opis musi mieć co najmniej 10 znaków'),
  pkd: z.string().min(2, 'Podaj kod PKD'),
  latitude: z.number({
    message: 'Podaj lokalizację',
  }),
  longitude: z.number({
    message: 'Podaj lokalizację',
  }),
  website: z.url('Podaj poprawny adres URL strony').optional(),
  tags: z.array(z.string()).min(1, 'Wybierz co najmniej jeden tag'),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export default function BusinessForm() {
  const { data: tags, isPending, isError } = trpc.tag.list.useQuery();

  if (isPending) {
    return <div>Ładowanie tagów...</div>;
  }

  if (isError) {
    return <div>Błąd podczas ładowania tagów</div>;
  }

  return <BusinessFormInner tags={tags || []} />;
}

type Props = {
  tags: TagDTO[];
};

function BusinessFormInner({ tags }: Props) {
  const [isGeocoding, setIsGeocoding] = useState(false);

  const createBusiness = trpc.business.create.useMutation();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
      nip: '',
      pkd: '',
      tags: [],
      latitude: undefined,
      longitude: undefined,
    },
  });

  const latitude = useWatch({
    control: form.control,
    name: 'latitude',
  });

  const longitude = useWatch({
    control: form.control,
    name: 'longitude',
  });

  const utils = trpc.useUtils();

  const handleGeocode = async () => {
    const address = form.getValues('address');
    if (!address || address.length < 5) return;

    setIsGeocoding(true);
    try {
      const data = await utils.business.geocode.fetch({ address });

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        form.setValue('latitude', parseFloat(lat), { shouldValidate: true });
        form.setValue('longitude', parseFloat(lon), { shouldValidate: true });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const onSubmit = async (data: BusinessFormValues) => {
    try {
      await createBusiness.mutateAsync(data);
    } catch (error) {
      console.error('Błąd podczas tworzenia biznesu:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nazwa biznesu</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="np. Restauracja u Jacka"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="nip"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>NIP</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="1234567890"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>10 cyfr bez spacji i myślników</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Adres</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    placeholder="ul. Główna 1, 00-001 Warszawa"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupButton
                    onClick={handleGeocode}
                    disabled={isGeocoding || !field.value || field.value.length < 5}
                    className="mr-1"
                  >
                    <HugeiconsIcon
                      icon={Search01Icon}
                      strokeWidth={2}
                      className={cn('size-3.5', isGeocoding && 'animate-spin')}
                    />
                    {isGeocoding ? 'Szukanie...' : 'Znajdź na mapie'}
                  </InputGroupButton>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field
            data-invalid={!!form.formState.errors.latitude || !!form.formState.errors.longitude}
          >
            <FieldLabel>Lokalizacja biznesu</FieldLabel>
            <Drawer.Root>
              <Drawer.Trigger asChild>
                <Button variant="outline" type="button" className="w-full gap-2">
                  <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="size-4" />
                  Wybierz lokalizację na mapie
                </Button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-bg flex flex-col rounded-t-[10px] h-[70vh] fixed bottom-0 left-0 right-0 z-50">
                  <div className="p-4 bg-bg rounded-t-[10px] flex-1 overflow-y-auto">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
                    <div className="max-w-md mx-auto">
                      <Drawer.Title className="font-medium mb-4 text-center">
                        Wybierz lokalizację
                      </Drawer.Title>
                      <MapPicker
                        latitude={latitude}
                        longitude={longitude}
                        onChange={(lat, lng) => {
                          form.setValue('latitude', lat, { shouldValidate: true });
                          form.setValue('longitude', lng, { shouldValidate: true });
                        }}
                        className="mb-8"
                      />
                      <Drawer.Close asChild>
                        <Button className="w-full">Zatwierdź lokalizację</Button>
                      </Drawer.Close>
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>

            <div className="flex flex-col gap-2">
              {latitude !== undefined && longitude !== undefined && (
                <p className="text-xs text-muted-foreground px-1">
                  Wybrana lokalizacja: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              )}
            </div>

            {(form.formState.errors.latitude || form.formState.errors.longitude) && (
              <FieldError
                errors={[form.formState.errors.latitude, form.formState.errors.longitude].filter(
                  (e): e is NonNullable<typeof e> => !!e,
                )}
              />
            )}
          </Field>

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Opis</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Krótki opis Twojej działalności..."
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Opisz czym zajmuje się Twój biznes</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="pkd"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kod PKD</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="np. 56.10.A"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="website"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Strona WWW</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="https://example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="tags"
            render={({ field, fieldState }) => {
              const anchor = useComboboxAnchor();
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tagi</FieldLabel>
                  <Combobox
                    multiple
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                  >
                    <ComboboxChips id={field.name} aria-invalid={fieldState.invalid} ref={anchor}>
                      {field.value.map((val) => {
                        const tag = tags.find((t) => t.id === val);
                        return (
                          <ComboboxChip key={val} value={val}>
                            {tag?.name || val}
                          </ComboboxChip>
                        );
                      })}
                      <ComboboxChipsInput
                        placeholder={field.value?.length > 0 ? '' : 'Wybierz tagi...'}
                      />
                    </ComboboxChips>
                    <ComboboxContent anchor={anchor}>
                      <ComboboxList>
                        {tags.map((tag) => (
                          <ComboboxItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </ComboboxItem>
                        ))}
                        <ComboboxEmpty>Nie znaleziono tagów</ComboboxEmpty>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <FieldDescription>Wybierz tagi najlepiej opisujące Twój biznes</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Utwórz profil biznesowy
        </Button>
      </div>
    </form>
  );
}
