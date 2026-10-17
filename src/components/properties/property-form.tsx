"use client";

/**
 * Owns the Admin property create/edit form.
 * Create flow: validate → insert property → parallel media resolve → batched related writes.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type { Location, LookupItem, Property, PropertyConfigVariant } from "@/types";
import {
  configurationDraftListSchema,
  masterPropertySchema,
} from "@/lib/validations";
import { getErrorMessage, slugify } from "@/lib/utils";
import { PUBLICATION_STATUSES, getVariantLabel } from "@/lib/constants";
import {
  createMasterProperty,
  isSlugAvailable,
  purgeProperty,
  updateMasterProperty,
  updatePropertyMedia,
} from "@/lib/api/properties";
import { createPropertyConfigurationsBatch } from "@/lib/api/property-configurations";
import { createFloorPlansBatch } from "@/lib/api/floor-plans";
import { setPropertyAmenitySelection } from "@/lib/api/amenities";
import { addPropertyImagesBatch } from "@/lib/api/property-images";
import { listActiveLocations } from "@/lib/api/locations";
import { listPropertyFormLookups } from "@/lib/api/lookups";
import { deleteFiles, storageFolders, uploadFile } from "@/lib/api/storage";
import type {
  FloorPlanInput,
  PropertyConfigurationInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGrid, ToggleField } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";
import { TagInput } from "@/components/shared/tag-input";
import {
  MediaPicker,
  unchangedSelection,
  uploadSelection,
  type FileSelection,
} from "@/components/shared/media-picker";
import { MapPicker } from "@/components/properties/map-picker";
import { CompanyOverviewSection } from "@/components/properties/company-overview-section";
import {
  ConfigurationRowsEditor,
  createEmptyConfigurationRow,
  draftRowToConfigurationInput,
  draftRowsToValidationInput,
  type ConfigurationDraftRow,
} from "@/components/properties/configuration-rows-editor";
import {
  AddPropertyAmenities,
  type AmenityDraftSelection,
} from "@/components/properties/add-property-amenities";
import {
  AddPropertyImages,
  type PendingPropertyImage,
} from "@/components/properties/add-property-images";
import {
  AddPropertyFloorPlans,
  emptyFloorPlansDraft,
  hasLayoutPick,
  type FloorPlansDraft,
  type LayoutPick,
} from "@/components/properties/add-property-floor-plans";

type PropertyValues = z.input<typeof masterPropertySchema>;
type PropertyOutput = z.output<typeof masterPropertySchema>;

const NO_LOCATION = "none";
const NO_PHASE = "none";

interface PropertyFormProps {
  property?: Property;
  onSaved?: (property: Property) => void;
}

interface FormLookups {
  locations: LookupItem[];
  bhk: LookupItem[];
  statuses: LookupItem[];
  types: LookupItem[];
  amenities: LookupItem[];
  launchPhases: LookupItem[];
}

const emptyLookups: FormLookups = {
  locations: [],
  bhk: [],
  statuses: [],
  types: [],
  amenities: [],
  launchPhases: [],
};

const VARIANT_TO_BHK_SLUGS: Record<PropertyConfigVariant, string[]> = {
  "1bhk": ["1-bhk", "1bhk"],
  "2bhk": ["2-bhk", "2bhk"],
  "3bhk": ["3-bhk", "3bhk"],
  "4bhk": ["4-bhk", "4bhk"],
  "5bhk": ["5-bhk", "5bhk"],
  custom: [],
};

function resolveBhkIdFromVariant(
  variant: PropertyConfigVariant,
  bhkLookups: LookupItem[]
): string {
  const slugs = VARIANT_TO_BHK_SLUGS[variant];
  if (slugs.length === 0) return "";
  const match = bhkLookups.find((item) => slugs.includes(item.slug));
  if (match) return match.id;

  const label = getVariantLabel(variant).toLowerCase();
  const byName = bhkLookups.find(
    (item) => item.name.toLowerCase() === label
  );
  return byName?.id ?? "";
}

async function resolveLayoutMedia(
  pick: LayoutPick,
  folder: string
): Promise<{ path: string; url: string; newlyUploaded: boolean } | null> {
  if (pick.kind === "none") return null;
  if (pick.kind === "existing") {
    // Reuse existing storage path — never download/re-upload.
    return { path: pick.path, url: pick.url, newlyUploaded: false };
  }
  const uploaded = await uploadFile(pick.file, folder);
  return { ...uploaded, newlyUploaded: true };
}

/** Price and carpet area start blank on a new property, hence `DefaultValues`. */
function toFormValues(property?: Property): DefaultValues<PropertyValues> {
  return {
    title: property?.title ?? property?.name ?? "",
    slug: property?.slug ?? "",
    tagline: property?.tagline ?? "",
    description:
      property?.description ?? property?.project_overview ?? "",
    highlights: property?.highlights ?? [],
    developer_name: property?.developer_name ?? "",
    developer_description: property?.developer_description ?? "",
    lookup_location_id: property?.lookup_location_id ?? "",
    sub_location: property?.sub_location ?? property?.locality ?? "",
    property_type_id: property?.property_type_id ?? "",
    bhk_id: property?.bhk_id ?? "",
    status_id: property?.status_id ?? "",
    price: property?.price ?? undefined,
    carpet_area_sqft: property?.carpet_area_sqft ?? undefined,
    super_area: property?.super_area ?? null,
    possession_date: property?.possession_date ?? property?.possession ?? "",
    floor: property?.floor ?? "",
    is_featured: property?.is_featured ?? false,
    recently_added: property?.recently_added ?? false,
    price_on_request: property?.price_on_request ?? false,
    is_recommended: property?.is_recommended ?? false,
    is_new_launch: property?.is_new_launch ?? false,
    is_luxury_collection: property?.is_luxury_collection ?? false,
    launch_phase_id: property?.launch_phase_id ?? "",
    rera_id: property?.rera_id ?? property?.rera_number ?? "",
    latitude: property?.latitude ?? null,
    longitude: property?.longitude ?? null,
    publication_status: property?.publication_status ?? "draft",
    sort_order: property?.sort_order ?? 0,
    meta_title: property?.meta_title ?? "",
    meta_description: property?.meta_description ?? "",
    location_id: property?.location_id ?? "",
  };
}

export function PropertyForm({ property, onSaved }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = Boolean(property);

  const [lookups, setLookups] = React.useState<FormLookups>(emptyLookups);
  const [locations, setLocations] = React.useState<Location[]>([]);
  // Once the slug is edited by hand, stop deriving it from the title.
  const [slugLocked, setSlugLocked] = React.useState(isEdit);

  const [configRows, setConfigRows] = React.useState<ConfigurationDraftRow[]>([
    createEmptyConfigurationRow(),
  ]);
  const [configErrors, setConfigErrors] = React.useState<
    Array<Partial<Record<"variant_code" | "custom_type" | "title" | "area_range" | "price_indicator", string>>>
  >([]);
  const [configListError, setConfigListError] = React.useState<string | undefined>();

  const [amenitiesDraft, setAmenitiesDraft] =
    React.useState<AmenityDraftSelection>({
      lookupAmenityIds: [],
      exclusiveLabels: [],
    });

  const [pendingImages, setPendingImages] = React.useState<
    PendingPropertyImage[]
  >([]);
  const [floorPlansDraft, setFloorPlansDraft] = React.useState<FloorPlansDraft>(
    emptyFloorPlansDraft
  );
  const [reraQr, setReraQr] =
    React.useState<FileSelection>(unchangedSelection);
  // Guards double-submit beyond RHF isSubmitting (e.g. rapid re-clicks).
  const createInFlightRef = React.useRef(false);

  const form = useForm<PropertyValues, unknown, PropertyOutput>({
    resolver: zodResolver(masterPropertySchema),
    defaultValues: toFormValues(property),
  });

  React.useEffect(() => {
    listPropertyFormLookups()
      .then((loaded) =>
        setLookups({
          locations: loaded.locations,
          bhk: loaded.bhk,
          statuses: loaded.statuses,
          types: loaded.types,
          amenities: loaded.amenities,
          launchPhases: loaded.launchPhases,
        })
      )
      .catch((error) => toast.error(getErrorMessage(error)));

    listActiveLocations()
      .then(setLocations)
      .catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  React.useEffect(() => {
    if (property) form.reset(toFormValues(property));
  }, [property, form]);

  const titleValue = form.watch("title");

  React.useEffect(() => {
    if (slugLocked) return;
    form.setValue("slug", slugify(titleValue ?? ""), { shouldValidate: false });
  }, [titleValue, slugLocked, form]);

  function validateConfigurations(): boolean {
    if (isEdit) return true;

    const parsed = configurationDraftListSchema.safeParse(
      draftRowsToValidationInput(configRows)
    );

    if (parsed.success) {
      setConfigErrors([]);
      setConfigListError(undefined);
      return true;
    }

    const rowErrors: typeof configErrors = configRows.map(() => ({}));
    let listError: string | undefined;

    for (const issue of parsed.error.issues) {
      if (issue.path.length === 0) {
        listError = issue.message;
        continue;
      }
      const rowIndex = issue.path[0];
      const field = issue.path[1];
      if (
        typeof rowIndex === "number" &&
        typeof field === "string" &&
        rowErrors[rowIndex]
      ) {
        rowErrors[rowIndex][field as keyof (typeof rowErrors)[number]] =
          issue.message;
      } else if (typeof rowIndex === "number" && issue.path.length === 1) {
        listError = issue.message;
      }
    }

    setConfigErrors(rowErrors);
    setConfigListError(listError ?? "Fix configuration rows before saving.");
    return false;
  }

  async function onSubmit(values: PropertyOutput) {
    if (createInFlightRef.current) return;
    createInFlightRef.current = true;

    // Newly uploaded storage paths only — never delete reused existing assets.
    const uploadedPaths: string[] = [];

    try {
      // ---------------------------------------------------------------------------
      // VALIDATION (cheap checks before any network work)
      // ---------------------------------------------------------------------------
      const slugFree = await isSlugAvailable(values.slug, property?.id);
      if (!slugFree) {
        form.setError("slug", {
          message: "Another property already uses this slug.",
        });
        toast.error("That slug is already taken.");
        createInFlightRef.current = false;
        return;
      }

      if (!isEdit && !validateConfigurations()) {
        toast.error("Fix the Configuration section before creating.");
        createInFlightRef.current = false;
        return;
      }

      // ---------------------------------------------------------------------------
      // EDIT PATH — details (+ optional RERA QR). Media tabs own gallery/plans.
      // ---------------------------------------------------------------------------
      if (property) {
        const saved = await updateMasterProperty(property.id, values);

        if (reraQr.kind !== "unchanged") {
          const uploadedQr = await uploadSelection(
            reraQr,
            storageFolders.propertyRera(property.id)
          );
          if (uploadedQr?.path) uploadedPaths.push(uploadedQr.path);
          try {
            await updatePropertyMedia(property.id, { reraQr: uploadedQr });
          } catch (error) {
            await deleteFiles(uploadedPaths);
            throw error;
          }
          setReraQr(unchangedSelection);
        }

        toast.success("Property saved");
        onSaved?.(saved);
        return;
      }

      // ---------------------------------------------------------------------------
      // PROPERTY CREATION
      // Creates the master property first because related media/configuration
      // records require the generated property ID for storage paths + FKs.
      // ---------------------------------------------------------------------------
      const firstVariant = configRows[0]?.variant_code ?? "1bhk";
      const syncedBhkId =
        values.bhk_id ||
        resolveBhkIdFromVariant(firstVariant, lookups.bhk);

      const created = await createMasterProperty({
        ...values,
        bhk_id: syncedBhkId || null,
        floor: values.floor || null,
      });

      const layoutFolder = storageFolders.propertyLayouts(created.id);
      const floorFolder = storageFolders.propertyFloorPlans(created.id);
      const reraFolder = storageFolders.propertyRera(created.id);

      try {
        // -------------------------------------------------------------------------
        // MEDIA UPLOAD (parallel)
        // Independent new files upload concurrently. Existing selections reuse
        // path/URL and are never re-uploaded. Storage is not transactional with
        // Postgres — track new paths for cleanup if a later DB write fails.
        // -------------------------------------------------------------------------
        const [configMedia, masterMedia, floorMedia, reraMedia] =
          await Promise.all([
            Promise.all(
              configRows.map(async (row) => {
                const pick =
                  floorPlansDraft.individual[row.key]?.pick ??
                  ({ kind: "none" } as const);
                return resolveLayoutMedia(pick, layoutFolder);
              })
            ),
            hasLayoutPick(floorPlansDraft.master.pick)
              ? resolveLayoutMedia(floorPlansDraft.master.pick, floorFolder)
              : Promise.resolve(null),
            hasLayoutPick(floorPlansDraft.floor.pick)
              ? resolveLayoutMedia(floorPlansDraft.floor.pick, floorFolder)
              : Promise.resolve(null),
            reraQr.kind === "replace"
              ? uploadSelection(reraQr, reraFolder)
              : Promise.resolve(undefined),
          ]);

        for (const media of configMedia) {
          if (media?.newlyUploaded) uploadedPaths.push(media.path);
        }
        if (masterMedia?.newlyUploaded) uploadedPaths.push(masterMedia.path);
        if (floorMedia?.newlyUploaded) uploadedPaths.push(floorMedia.path);
        if (reraMedia?.path) uploadedPaths.push(reraMedia.path);

        // -------------------------------------------------------------------------
        // DATABASE SAVE (batched / parallel where independent)
        // Gallery uploads run inside addPropertyImagesBatch (parallel upload +
        // one insert). Configurations / floor plans / amenities / RERA can run
        // together after media paths are known.
        // -------------------------------------------------------------------------
        const configurationInputs: PropertyConfigurationInput[] =
          configRows.map((row, index) => ({
            ...draftRowToConfigurationInput(row, index),
            image_path: configMedia[index]?.path ?? "",
          }));

        const floorPlanRows: Array<{
          input: FloorPlanInput;
          image: { path: string; url: string } | null;
        }> = [];

        // Brand-new property: display_order starts at 0 (skip getNextFloorPlanOrder).
        let planOrder = 0;
        if (masterMedia) {
          floorPlanRows.push({
            input: {
              name: "Master Plan",
              plan_type: "master_plan",
              configuration_id: "",
              is_active: true,
              display_order: planOrder++,
            },
            image: { path: masterMedia.path, url: masterMedia.url },
          });
        }
        if (floorMedia) {
          floorPlanRows.push({
            input: {
              name: "Floor Plan",
              plan_type: "floor_plan",
              configuration_id: "",
              is_active: true,
              display_order: planOrder++,
            },
            image: { path: floorMedia.path, url: floorMedia.url },
          });
        }

        const hasAmenities =
          amenitiesDraft.lookupAmenityIds.length > 0 ||
          amenitiesDraft.exclusiveLabels.length > 0;

        await Promise.all([
          createPropertyConfigurationsBatch(created.id, configurationInputs),
          hasAmenities
            ? setPropertyAmenitySelection(created.id, amenitiesDraft)
            : Promise.resolve(),
          pendingImages.length > 0
            ? addPropertyImagesBatch(
                created.id,
                pendingImages.map((image) => ({
                  file: image.file,
                  altText: image.altText || created.title || undefined,
                  isPrimary: image.isPrimary,
                }))
              )
            : Promise.resolve(),
          createFloorPlansBatch(created.id, floorPlanRows),
          reraMedia !== undefined
            ? updatePropertyMedia(created.id, { reraQr: reraMedia })
            : Promise.resolve(),
        ]);
      } catch (error) {
        // All-or-nothing: a half-saved listing (row without its images or
        // configurations) is worse than none. Remove the row with everything
        // attached to it, plus any files uploaded in this attempt.
        await deleteFiles(uploadedPaths);
        await purgeProperty(created.id).catch(() => undefined);
        throw error;
      }

      toast.success("Property created", {
        description:
          "Opening Media & Documents for brochure. Configurations, amenities, gallery, RERA QR and floor plans were saved with this property.",
      });
      onSaved?.(created);
      router.push(`/admin/properties/${created.id}?tab=media`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      createInFlightRef.current = false;
    }
  }

  const { errors, isSubmitting, isDirty } = form.formState;
  const latitude = form.watch("latitude") ?? null;
  const longitude = form.watch("longitude") ?? null;
  const highlights = form.watch("highlights") ?? [];
  const isNewLaunch = form.watch("is_new_launch") ?? false;

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit,
        (errors) => {
          console.error("PROPERTY FORM VALIDATION ERRORS", errors);
          toast.error("Please fix the highlighted fields before saving.");
          document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ block: "center" });
        }
      )}
      className="space-y-4 pb-20"
      noValidate
    >
      {/* —— Property Information —— */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <CardDescription>
            How the residence is identified across the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGrid>
            <Field
              label="Title"
              htmlFor="title"
              required
              error={errors.title?.message}
            >
              <Input
                id="title"
                placeholder="Parmar Trident Towers"
                aria-invalid={Boolean(errors.title)}
                {...form.register("title")}
              />
            </Field>

            <Field
              label="URL slug"
              htmlFor="slug"
              required
              hint={
                slugLocked
                  ? "Used in the public URL."
                  : "Generated from the title — edit to take over."
              }
              error={errors.slug?.message}
            >
              <div className="flex gap-2">
                <Input
                  id="slug"
                  placeholder="parmar-trident-towers"
                  aria-invalid={Boolean(errors.slug)}
                  {...form.register("slug", {
                    onChange: () => setSlugLocked(true),
                  })}
                />
                {slugLocked && !isEdit ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Regenerate slug from title"
                    onClick={() => {
                      setSlugLocked(false);
                      form.setValue("slug", slugify(form.getValues("title")));
                    }}
                  >
                    <RotateCcw />
                  </Button>
                ) : null}
              </div>
            </Field>
          </FieldGrid>

          <Field
            label="Tagline"
            htmlFor="tagline"
            required
            hint="One line shown under the title on cards and the detail page."
            error={errors.tagline?.message}
          >
            <Input
              id="tagline"
              placeholder="Sea-facing residences on Worli Sea Face"
              aria-invalid={Boolean(errors.tagline)}
              {...form.register("tagline")}
            />
          </Field>

          <FieldGrid>
            <Field
              label="Property type"
              required
              error={errors.property_type_id?.message}
            >
              <Select
                value={form.watch("property_type_id") || ""}
                onValueChange={(value) =>
                  form.setValue("property_type_id", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger aria-label="Property type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.types.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Price (₹ Cr)"
              htmlFor="price"
              hint="Enter crores as a number — 20 means ₹20 Cr, 32.5 means ₹32.50 Cr."
              error={errors.price?.message}
            >
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                placeholder="20"
                aria-invalid={Boolean(errors.price)}
                {...form.register("price")}
              />
            </Field>

            <ToggleField
              label="Show as “Price on Request”"
              description="On: the public site hides the number above. Off: it shows the price."
              control={
                <Switch
                  checked={form.watch("price_on_request") ?? false}
                  onCheckedChange={(checked) =>
                    form.setValue("price_on_request", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              }
            />
          </FieldGrid>
        </CardContent>
      </Card>

      {/* —— Project Overview —— */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Editorial body and signature highlights shown in the Project
            Overview section on the public Property Detail page. Construction
            status and MahaRERA number are edited in Property Details and
            Compliance below — they are not duplicated here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Overview"
            htmlFor="description"
            required
            hint="The paragraph under Project Overview on the Detail page."
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={5}
              placeholder="Perfect harmony between cultural heritage and ultra-modern coastal architecture…"
              aria-invalid={Boolean(errors.description)}
              {...form.register("description")}
            />
          </Field>

          <Field
            label="Signature architectural highlights"
            htmlFor="highlights"
            hint="Optional. Three to five bullet points under Signature Architectural Highlights."
            error={
              errors.highlights?.message ??
              errors.highlights?.root?.message
            }
          >
            <TagInput
              id="highlights"
              value={highlights}
              placeholder="Uninterrupted Arabian Sea views"
              disabled={isSubmitting}
              onChange={(next) =>
                form.setValue("highlights", next, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </Field>
        </CardContent>
      </Card>

      {/* —— Company / Developer Overview —— */}
      <CompanyOverviewSection form={form} />

      {/* —— Location —— */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>
            Canonical micro-market relationship plus property-specific
            sub-location and map pin for Enclave Location &amp; Vicinity.
            Editorial location-page content is managed under Website content →
            Locations — not copied onto the property.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGrid>
            <Field
              label="Location"
              required
              hint="Lookup micro-market used for filtering (lookup_locations)."
              error={errors.lookup_location_id?.message}
            >
              <Select
                value={form.watch("lookup_location_id") || ""}
                onValueChange={(value) =>
                  form.setValue("lookup_location_id", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger aria-label="Location">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.locations.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Sub-location"
              htmlFor="sub_location"
              required
              hint="For example “Worli Sea Face, South Mumbai” — shown as the prime locality line."
              error={errors.sub_location?.message}
            >
              <Input
                id="sub_location"
                placeholder="Worli Sea Face, South Mumbai"
                aria-invalid={Boolean(errors.sub_location)}
                {...form.register("sub_location")}
              />
            </Field>

            <Field
              label="Micro-market page"
              hint="Optional link to the editorial location dossier (locations table)."
              error={errors.location_id?.message}
              className="sm:col-span-2"
            >
              <Select
                value={form.watch("location_id") || NO_LOCATION}
                onValueChange={(value) =>
                  form.setValue(
                    "location_id",
                    value === NO_LOCATION ? "" : value,
                    { shouldDirty: true }
                  )
                }
              >
                <SelectTrigger aria-label="Micro-market page">
                  <SelectValue placeholder="Not linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_LOCATION}>Not linked</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                      {location.city ? ` · ${location.city}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>

          <MapPicker
            latitude={latitude === null ? null : Number(latitude)}
            longitude={longitude === null ? null : Number(longitude)}
            latitudeError={errors.latitude?.message}
            longitudeError={errors.longitude?.message}
            onChange={({ latitude: lat, longitude: lng }) => {
              form.setValue("latitude", lat, { shouldDirty: true });
              form.setValue("longitude", lng, { shouldDirty: true });
            }}
          />
        </CardContent>
      </Card>

      {/* —— Configuration (create) / note (edit) —— */}
      {!isEdit ? (
        <ConfigurationRowsEditor
          rows={configRows}
          onChange={(next) => {
            setConfigRows(next);
            setConfigErrors([]);
            setConfigListError(undefined);
          }}
          disabled={isSubmitting}
          errors={configErrors}
          listError={configListError}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Typologies for this property are managed on the Configurations
              tab (BHK / type, name, area range, price range, and breakdowns).
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!isEdit ? (
        <AddPropertyFloorPlans
          configRows={configRows}
          value={floorPlansDraft}
          onChange={setFloorPlansDraft}
          disabled={isSubmitting}
        />
      ) : null}

      {/* —— Property Details —— */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>
            Property-level possession and construction status shown on cards
            and the Detail page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGrid>
            <Field
              label="Possession"
              htmlFor="possession_date"
              required
              hint="Free text, for example “Ready to Move” or “Q4 2027”."
              error={errors.possession_date?.message}
            >
              <Input
                id="possession_date"
                placeholder="Q4 2027"
                aria-invalid={Boolean(errors.possession_date)}
                {...form.register("possession_date")}
              />
            </Field>

            <Field
              label="Construction status"
              required
              error={errors.status_id?.message}
            >
              <Select
                value={form.watch("status_id") || ""}
                onValueChange={(value) =>
                  form.setValue("status_id", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger aria-label="Construction status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.statuses.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGrid>
        </CardContent>
      </Card>

      {/* Area fields remain on edit. Main catalogue price lives in Property
          Information (create + edit) so Add Property can set it. */}
      {isEdit ? (
        <Card>
          <CardHeader>
            <CardTitle>Pricing &amp; Area</CardTitle>
            <CardDescription>
              Areas drive card and detail specs. Catalogue price is edited under
              Property Information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGrid>
              <Field
                label="Carpet area (sq ft)"
                htmlFor="carpet_area_sqft"
                required
                error={errors.carpet_area_sqft?.message}
              >
                <Input
                  id="carpet_area_sqft"
                  type="number"
                  min={0}
                  step="1"
                  placeholder="1820"
                  aria-invalid={Boolean(errors.carpet_area_sqft)}
                  {...form.register("carpet_area_sqft")}
                />
              </Field>

              <Field
                label="Super area (sq ft)"
                htmlFor="super_area"
                hint="Optional, shown in the detail specs."
                error={errors.super_area?.message}
              >
                <Input
                  id="super_area"
                  type="number"
                  min={0}
                  step="1"
                  placeholder="2450"
                  {...form.register("super_area")}
                />
              </Field>
            </FieldGrid>
          </CardContent>
        </Card>
      ) : null}

      {/* —— Compliance —— */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance</CardTitle>
          <CardDescription>
            Project MahaRERA number and QR code. Brochure and floor plans remain
            under Media &amp; Documents after the property is saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field
            label="MahaRERA number"
            htmlFor="rera_id"
            required
            error={errors.rera_id?.message}
          >
            <Input
              id="rera_id"
              placeholder="P51900012345"
              aria-invalid={Boolean(errors.rera_id)}
              {...form.register("rera_id")}
            />
          </Field>

          <Field
            label="RERA QR Code"
            hint="Image only (JPEG/PNG/WebP). Preview, replace or remove. Uses the existing property RERA storage path."
          >
            <MediaPicker
              existingUrl={
                isEdit
                  ? property?.rera_qr_url ?? property?.rera_qr_image
                  : null
              }
              selection={reraQr}
              onSelectionChange={setReraQr}
              disabled={isSubmitting}
              emptyLabel="Upload RERA QR image"
            />
          </Field>
        </CardContent>
      </Card>

      {/* —— Amenities (create) —— */}
      {!isEdit ? (
        <AddPropertyAmenities
          catalog={lookups.amenities}
          value={amenitiesDraft}
          onChange={setAmenitiesDraft}
          disabled={isSubmitting}
        />
      ) : null}

      {/* —— Publishing / SEO —— */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing &amp; SEO</CardTitle>
          <CardDescription>
            Where this residence appears, collection flags, and search engine
            overrides.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGrid>
            <Field
              label="Publication status"
              hint="Only published residences are visible to the public."
              error={errors.publication_status?.message}
            >
              <Select
                value={form.watch("publication_status") ?? "published"}
                onValueChange={(value) =>
                  form.setValue(
                    "publication_status",
                    value as PropertyValues["publication_status"],
                    { shouldDirty: true }
                  )
                }
              >
                <SelectTrigger aria-label="Publication status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PUBLICATION_STATUSES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Sort order"
              htmlFor="sort_order"
              hint="Lower numbers come first in the catalogue."
              error={errors.sort_order?.message}
            >
              <Input
                id="sort_order"
                type="number"
                min={0}
                step="1"
                {...form.register("sort_order")}
              />
            </Field>
          </FieldGrid>

          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField
              label="Featured"
              description="Shown in the highlighted set on the home page."
              control={
                <Switch
                  checked={form.watch("is_featured") ?? false}
                  onCheckedChange={(checked) =>
                    form.setValue("is_featured", checked, { shouldDirty: true })
                  }
                />
              }
            />
            <ToggleField
              label="Recently added"
              description="Gives the listing sort priority and a badge."
              control={
                <Switch
                  checked={form.watch("recently_added") ?? false}
                  onCheckedChange={(checked) =>
                    form.setValue("recently_added", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              }
            />
            <ToggleField
              label="Recommended pick"
              description="Adds the editorial recommendation badge."
              control={
                <Switch
                  checked={form.watch("is_recommended") ?? false}
                  onCheckedChange={(checked) =>
                    form.setValue("is_recommended", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              }
            />
            <ToggleField
              label="New launch"
              description="Places the listing in the New Launches tab."
              control={
                <Switch
                  checked={isNewLaunch}
                  onCheckedChange={(checked) =>
                    form.setValue("is_new_launch", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              }
            />
            <ToggleField
              label="Luxury collection"
              description="Include in Luxury Collection (also auto for ₹25 Cr+)."
              control={
                <Switch
                  checked={form.watch("is_luxury_collection") ?? false}
                  onCheckedChange={(checked) =>
                    form.setValue("is_luxury_collection", checked, {
                      shouldDirty: true,
                    })
                  }
                />
              }
            />
          </div>

          <Field
            label="Launch phase"
            hint="Badge shown on new launch cards."
            error={errors.launch_phase_id?.message}
          >
            <Select
              value={form.watch("launch_phase_id") || NO_PHASE}
              onValueChange={(value) =>
                form.setValue(
                  "launch_phase_id",
                  value === NO_PHASE ? "" : value,
                  { shouldDirty: true }
                )
              }
            >
              <SelectTrigger aria-label="Launch phase">
                <SelectValue placeholder="Not set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PHASE}>Not set</SelectItem>
                {lookups.launchPhases.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Meta title"
            htmlFor="meta_title"
            error={errors.meta_title?.message}
          >
            <Input
              id="meta_title"
              placeholder="Sea-facing 4 BHK residences in Worli"
              {...form.register("meta_title")}
            />
          </Field>

          <Field
            label="Meta description"
            htmlFor="meta_description"
            error={errors.meta_description?.message}
          >
            <Textarea
              id="meta_description"
              rows={2}
              placeholder="A short summary for search results."
              {...form.register("meta_description")}
            />
          </Field>
        </CardContent>
      </Card>

      {/* —— Property Images (create, end of form) —— */}
      {!isEdit ? (
        <AddPropertyImages
          images={pendingImages}
          onChange={setPendingImages}
          disabled={isSubmitting}
          defaultAlt={titleValue}
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {isEdit
              ? isDirty || reraQr.kind !== "unchanged"
                ? "You have unsaved changes."
                : "All changes saved."
              : "Create saves property details, configurations, floor plans, amenities, gallery images and RERA QR. Brochure stays on Media & Documents."}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => router.push("/admin/properties")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : <Save />}
              {isEdit ? "Save changes" : "Create property"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
