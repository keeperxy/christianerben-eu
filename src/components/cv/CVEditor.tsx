import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Minus } from "lucide-react";
import { useSettings } from "@/contexts/settings-hook";
import { SiteContent, Experience, ExperienceDescriptionItem, Project, Skill } from "@/content/content";
type LocalizedString = { en: string; de: string };

type FieldValue = string | number | boolean | LocalizedString | ExperienceDescriptionItem[] | LocalizedString[];
type ArrayItemTemplate = Experience | Project | Skill | LocalizedString | ExperienceDescriptionItem;

interface CVEditorProps {
  data: SiteContent;
  onChange: (newData: SiteContent) => void;
  language: "en" | "de";
}

const CVEditor: React.FC<CVEditorProps> = ({ data, onChange, language }) => {
  const { t } = useSettings();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: true,
    about: true,
    experiences: false,
    skills: false,
    projects: false,
    footer: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (path: (string | number)[], value: FieldValue) => {
    // Create a deep copy of the data
    const newData = JSON.parse(JSON.stringify(data));
    
    // Navigate to the correct property and update it
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    onChange(newData);
  };

  const handleMultiLangChange = (path: (string | number)[], lang: 'en' | 'de', value: string) => {
    // Create a deep copy of the data
    const newData = JSON.parse(JSON.stringify(data));
    
    // Navigate to the correct property
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    // Update the language-specific value
    const key = path[path.length - 1];
    current[key] = {
      ...current[key],
      [lang]: value
    };
    
    onChange(newData);
  };

  const addArrayItem = (path: string[], template: ArrayItemTemplate) => {
    // Create a deep copy of the data
    const newData = JSON.parse(JSON.stringify(data));
    
    // Navigate to the correct array
    let current = newData;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    
    // Add the new item
    current.push(template);
    
    onChange(newData);
  };

  const removeArrayItem = (path: string[], index: number) => {
    // Create a deep copy of the data
    const newData = JSON.parse(JSON.stringify(data));
    
    // Navigate to the correct array
    let current = newData;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    
    // Remove the item
    current.splice(index, 1);
    
    onChange(newData);
  };

  const addExperienceDescriptionItem = (expIndex: number, type: 'text' | 'achievement') => {
    // Create a deep copy of the data
    const newData = JSON.parse(JSON.stringify(data));
    
    // Add new description item
    newData.experiences[expIndex].description.push({
      type,
      text: {
        en: 'New entry',
        de: 'Neuer Eintrag'
      }
    });
    
    onChange(newData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Save className="mr-2 h-5 w-5" />
        {t({
          en: 'CV Editor',
          de: 'Lebenslauf-Editor'
        })}
      </h2>
      
      {/* Header Section */}
      <div className="mb-8 border-b pb-4">
        <button 
          onClick={() => toggleSection('header')}
          className="w-full text-left font-bold text-lg mb-4 flex items-center"
        >
          {expandedSections.header ? <Minus className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {t({ en: 'Header', de: 'Kopfbereich' })}
        </button>
        {expandedSections.header && (
          <div className="space-y-4 pl-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({ en: 'Name', de: 'Name' })} (displayed as header name)
              </label>
              <Input 
                value={data.hero.name != null ? String(data.hero.name) : ''}
                onChange={(e) => handleChange(['hero', 'name'], String(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({ en: 'Email', de: 'E-Mail' })}
              </label>
              <Input
                value={data.contact.cvemail}
                onChange={(e) => handleChange(['contact', 'cvemail'], String(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({ en: 'Phone', de: 'Telefon' })}
              </label>
              <Input
                value={data.contact.phone}
                onChange={(e) => handleChange(['contact', 'phone'], String(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({ en: 'Street', de: 'Straße' })}
              </label>
              <Input 
                value={data.imprint.address.street.en != null ? data.imprint.address.street.en : ''}
                onChange={(e) => handleMultiLangChange(['imprint', 'address', 'street'], 'en', e.target.value)}
                placeholder="EN"
              />
              <Input 
                value={data.imprint.address.street.de != null ? data.imprint.address.street.de : ''}
                onChange={(e) => handleMultiLangChange(['imprint', 'address', 'street'], 'de', e.target.value)}
                placeholder="DE"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({ en: 'City', de: 'Stadt' })}
              </label>
              <Input 
                value={data.imprint.address.city.en != null ? data.imprint.address.city.en : ''}
                onChange={(e) => handleMultiLangChange(['imprint', 'address', 'city'], 'en', e.target.value)}
                placeholder="EN"
              />
              <Input 
                value={data.imprint.address.city.de != null ? data.imprint.address.city.de : ''}
                onChange={(e) => handleMultiLangChange(['imprint', 'address', 'city'], 'de', e.target.value)}
                placeholder="DE"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({ en: 'Country', de: 'Land' })}
              </label>
              <Input 
                value={data.imprint.address.country.en != null ? data.imprint.address.country.en : ''}
                onChange={(e) => handleMultiLangChange(['imprint', 'address', 'country'], 'en', e.target.value)}
                placeholder="EN"
              />
              <Input 
                value={data.imprint.address.country.de != null ? data.imprint.address.country.de : ''}
                onChange={(e) => handleMultiLangChange(['imprint', 'address', 'country'], 'de', e.target.value)}
                placeholder="DE"
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* About Section */}
      <div className="mb-8 border-b pb-4">
        <button 
          onClick={() => toggleSection('about')}
          className="w-full text-left font-bold text-lg mb-4 flex items-center"
        >
          {expandedSections.about ? <Minus className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {t({
            en: 'Profile',
            de: 'Profil'
          })}
        </button>
        
        {expandedSections.about && (
          <div className="space-y-4 pl-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({
                  en: 'First Paragraph (EN)',
                  de: 'Erster Absatz (EN)'
                })}
              </label>
              <Textarea 
                value={data.about.paragraphs[0].en != null ? String(data.about.paragraphs[0].en) : '' as string} 
                onChange={(e) => handleMultiLangChange(['about', 'paragraphs', 0], 'en', String(e.target.value))}
                className="mb-2"
              />
              
              <label className="block text-sm font-medium mb-1">
                {t({
                  en: 'First Paragraph (DE)',
                  de: 'Erster Absatz (DE)'
                })}
              </label>
              <Textarea 
                value={data.about.paragraphs[0].de != null ? String(data.about.paragraphs[0].de) : '' as string} 
                onChange={(e) => handleMultiLangChange(['about', 'paragraphs', 0], 'de', String(e.target.value))}
                className="mb-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({
                  en: 'Second Paragraph (EN)',
                  de: 'Zweiter Absatz (EN)'
                })}
              </label>
              <Textarea 
                value={data.about.paragraphs[1].en != null ? String(data.about.paragraphs[1].en) : '' as string} 
                onChange={(e) => handleMultiLangChange(['about', 'paragraphs', 1], 'en', String(e.target.value))}
                className="mb-2"
              />
              
              <label className="block text-sm font-medium mb-1">
                {t({
                  en: 'Second Paragraph (DE)',
                  de: 'Zweiter Absatz (DE)'
                })}
              </label>
              <Textarea 
                value={data.about.paragraphs[1].de != null ? String(data.about.paragraphs[1].de) : '' as string} 
                onChange={(e) => handleMultiLangChange(['about', 'paragraphs', 1], 'de', String(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Experiences Section */}
      <div className="mb-8 border-b pb-4">
        <button 
          onClick={() => toggleSection('experiences')}
          className="w-full text-left font-bold text-lg mb-4 flex items-center"
        >
          {expandedSections.experiences ? <Minus className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {t({
            en: 'Experiences',
            de: 'Berufserfahrung'
          })}
        </button>
        
        {expandedSections.experiences && (
          <div className="space-y-6">
            {data.experiences.map((exp: Experience, expIndex: number) => (
              <div key={expIndex} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{`Experience ${expIndex + 1}`}</h3>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => removeArrayItem(['experiences'], expIndex)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Title (EN)',
                        de: 'Titel (EN)'
                      })}
                    </label>
                    <Input 
                      value={exp.title.en != null ? String(exp.title.en) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['experiences', expIndex, 'title'], 'en', String(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Title (DE)',
                        de: 'Titel (DE)'
                      })}
                    </label>
                    <Input 
                      value={exp.title.de != null ? String(exp.title.de) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['experiences', expIndex, 'title'], 'de', String(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Company',
                        de: 'Firma'
                      })}
                    </label>
                    <Input 
                      value={exp.company != null ? String(exp.company) : '' as string} 
                      onChange={(e) => handleChange(['experiences', expIndex, 'company'], String(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Location (EN)',
                        de: 'Ort (EN)'
                      })}
                    </label>
                    <Input 
                      value={exp.location.en != null ? String(exp.location.en) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['experiences', expIndex, 'location'], 'en', String(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Location (DE)',
                        de: 'Ort (DE)'
                      })}
                    </label>
                    <Input 
                      value={exp.location.de != null ? String(exp.location.de) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['experiences', expIndex, 'location'], 'de', String(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Period (EN)',
                        de: 'Zeitraum (EN)'
                      })}
                    </label>
                    <Input 
                      value={exp.period.en != null ? String(exp.period.en) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['experiences', expIndex, 'period'], 'en', String(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Period (DE)',
                        de: 'Zeitraum (DE)'
                      })}
                    </label>
                    <Input 
                      value={exp.period.de != null ? String(exp.period.de) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['experiences', expIndex, 'period'], 'de', String(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      {t({
                        en: 'Description Items',
                        de: 'Beschreibungen'
                      })}
                    </label>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => addExperienceDescriptionItem(expIndex, 'text')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t({
                          en: 'Text',
                          de: 'Text'
                        })}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => addExperienceDescriptionItem(expIndex, 'achievement')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t({
                          en: 'Achievement',
                          de: 'Erfolg'
                        })}
                      </Button>
                    </div>
                  </div>
                  
                  {exp.description.map((item: ExperienceDescriptionItem, descIndex: number) => (
                    <div key={descIndex} className="p-3 border rounded mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {item.type === 'text' ? 
                            t({en: 'Text', de: 'Text'}) : 
                            t({en: 'Achievement', de: 'Erfolg'})}
                        </span>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData.experiences[expIndex].description.splice(descIndex, 1);
                            onChange(newData);
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div>
                        <label className="block text-xs mb-1">EN</label>
                        <Textarea 
                          value={item.text.en != null ? String(item.text.en) : '' as string} 
                          onChange={(e) => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData.experiences[expIndex].description[descIndex].text.en = String(e.target.value);
                            onChange(newData);
                          }}
                          className="mb-2 text-sm"
                          rows={2}
                        />
                        
                        <label className="block text-xs mb-1">DE</label>
                        <Textarea 
                          value={item.text.de != null ? String(item.text.de) : '' as string} 
                          onChange={(e) => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData.experiences[expIndex].description[descIndex].text.de = String(e.target.value);
                            onChange(newData);
                          }}
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t({
                      en: 'Tags',
                      de: 'Stichworte'
                    })}
                  </label>
                  {exp.tags.map((tag: LocalizedString, tagIndex: number) => (
                    <div key={tagIndex} className="flex mb-2">
                      <div className="flex-1 mr-2">
                        <Input 
                          value={tag.en != null ? String(tag.en) : '' as string} 
                          onChange={(e) => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData.experiences[expIndex].tags[tagIndex].en = String(e.target.value);
                            onChange(newData);
                          }}
                          placeholder="English"
                          className="mb-1"
                        />
                        <Input 
                          value={tag.de != null ? String(tag.de) : '' as string} 
                          onChange={(e) => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData.experiences[expIndex].tags[tagIndex].de = String(e.target.value);
                            onChange(newData);
                          }}
                          placeholder="Deutsch"
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="h-auto"
                        onClick={() => {
                          const newData = JSON.parse(JSON.stringify(data));
                          newData.experiences[expIndex].tags.splice(tagIndex, 1);
                          onChange(newData);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newData = JSON.parse(JSON.stringify(data));
                      newData.experiences[expIndex].tags.push({
                        en: 'New Tag',
                        de: 'Neues Stichwort'
                      });
                      onChange(newData);
                    }}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t({
                      en: 'Add Tag',
                      de: 'Stichwort hinzufügen'
                    })}
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              onClick={() => addArrayItem(['experiences'], {
                title: { en: 'New Position', de: 'Neue Position' },
                company: 'Company Name',
                location: { en: 'Location', de: 'Ort' },
                period: { en: 'Month Year - Present', de: 'Monat Jahr - Heute' },
                description: [
                  { 
                    type: 'text', 
                    text: { en: 'Description', de: 'Beschreibung' } 
                  }
                ],
                tags: [
                  { en: 'New Tag', de: 'Neues Stichwort' }
                ]
              })}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t({
                en: 'Add Experience',
                de: 'Erfahrung hinzufügen'
              })}
            </Button>
          </div>
        )}
      </div>
      
      {/* Projects Section */}
      <div className="mb-8 border-b pb-4">
        <button 
          onClick={() => toggleSection('projects')}
          className="w-full text-left font-bold text-lg mb-4 flex items-center"
        >
          {expandedSections.projects ? <Minus className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {t({
            en: 'Projects',
            de: 'Projekte'
          })}
        </button>
        
        {expandedSections.projects && (
          <div className="space-y-6">
            {data.projects.map((project: Project, projectIndex: number) => (
              <div key={projectIndex} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{`Project ${projectIndex + 1}`}</h3>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => removeArrayItem(['projects'], projectIndex)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Title (EN)',
                        de: 'Titel (EN)'
                      })}
                    </label>
                    <Input 
                      value={project.title.en != null ? String(project.title.en) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['projects', projectIndex, 'title'], 'en', String(e.target.value))}
                      className="mb-2"
                    />
                    
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Title (DE)',
                        de: 'Titel (DE)'
                      })}
                    </label>
                    <Input 
                      value={project.title.de != null ? String(project.title.de) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['projects', projectIndex, 'title'], 'de', String(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Description (EN)',
                        de: 'Beschreibung (EN)'
                      })}
                    </label>
                    <Textarea 
                      value={project.description.en != null ? String(project.description.en) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['projects', projectIndex, 'description'], 'en', String(e.target.value))}
                      className="mb-2"
                    />
                    
                    <label className="block text-sm font-medium mb-1">
                      {t({
                        en: 'Description (DE)',
                        de: 'Beschreibung (DE)'
                      })}
                    </label>
                    <Textarea 
                      value={project.description.de != null ? String(project.description.de) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['projects', projectIndex, 'description'], 'de', String(e.target.value))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t({
                      en: 'Tags',
                      de: 'Stichworte'
                    })}
                  </label>
                  {project.tags.map((tag: LocalizedString, tagIndex: number) => (
                    <div key={tagIndex} className="flex mb-2">
                      <div className="flex-1 mr-2">
                        <Input 
                          value={tag.en != null ? String(tag.en) : '' as string} 
                          onChange={(e) => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData.projects[projectIndex].tags[tagIndex].en = String(e.target.value);
                            onChange(newData);
                          }}
                          placeholder="English"
                          className="mb-1"
                        />
                        <Input 
                          value={tag.de != null ? String(tag.de) : '' as string} 
                          onChange={(e) => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData.projects[projectIndex].tags[tagIndex].de = String(e.target.value);
                            onChange(newData);
                          }}
                          placeholder="Deutsch"
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="h-auto"
                        onClick={() => {
                          const newData = JSON.parse(JSON.stringify(data));
                          newData.projects[projectIndex].tags.splice(tagIndex, 1);
                          onChange(newData);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newData = JSON.parse(JSON.stringify(data));
                      newData.projects[projectIndex].tags.push({
                        en: 'New Tag',
                        de: 'Neues Stichwort'
                      });
                      onChange(newData);
                    }}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t({
                      en: 'Add Tag',
                      de: 'Stichwort hinzufügen'
                    })}
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              onClick={() => addArrayItem(['projects'], {
                title: { en: 'New Project', de: 'Neues Projekt' },
                description: { en: 'Project description', de: 'Projektbeschreibung' },
                imageUrl: '',
                imageAlt: { en: 'Project image', de: 'Projektbild' },
                tags: [
                  { en: 'New Tag', de: 'Neues Stichwort' }
                ]
              })}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t({
                en: 'Add Project',
                de: 'Projekt hinzufügen'
              })}
            </Button>
          </div>
        )}
      </div>
      
      {/* Skills Section */}
      <div className="mb-8">
        <button 
          onClick={() => toggleSection('skills')}
          className="w-full text-left font-bold text-lg mb-4 flex items-center"
        >
          {expandedSections.skills ? <Minus className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {t({
            en: 'Skills',
            de: 'Fähigkeiten'
          })}
        </button>
        
        {expandedSections.skills && (
          <div className="space-y-6">
            {data.skills.map((skill: Skill, skillIndex: number) => (
              <div key={skillIndex} className="p-3 border rounded-lg flex items-center">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t({
                        en: 'Name (EN)',
                        de: 'Name (EN)'
                      })}
                    </label>
                    <Input 
                      value={skill.name.en != null ? String(skill.name.en) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['skills', skillIndex, 'name'], 'en', String(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t({
                        en: 'Name (DE)',
                        de: 'Name (DE)'
                      })}
                    </label>
                    <Input 
                      value={skill.name.de != null ? String(skill.name.de) : '' as string} 
                      onChange={(e) => handleMultiLangChange(['skills', skillIndex, 'name'], 'de', String(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t({
                        en: 'Category',
                        de: 'Kategorie'
                      })}
                    </label>
                    <Input 
                      value={skill.category != null ? String(skill.category) : '' as string} 
                      onChange={(e) => handleChange(['skills', skillIndex, 'category'], String(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      {t({
                        en: 'Level (1-5)',
                        de: 'Level (1-5)'
                      })}
                    </label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="5" 
                      value={skill.level != null ? String(skill.level) : '' as string} 
                      onChange={(e) => handleChange(['skills', skillIndex, 'level'], parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="ml-2"
                  onClick={() => removeArrayItem(['skills'], skillIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              onClick={() => addArrayItem(['skills'], {
                name: { en: 'New Skill', de: 'Neue Fähigkeit' },
                category: 'management',
                icon: Save,
                level: 3,
              })}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t({
                en: 'Add Skill',
                de: 'Fähigkeit hinzufügen'
              })}
            </Button>
          </div>
        )}
      </div>
      
      {/* Footer Section */}
      <div className="mb-8 border-b pb-4">
        <button
          onClick={() => toggleSection('footer')}
          className="w-full text-left font-bold text-lg mb-4 flex items-center"
        >
          {expandedSections.footer ? <Minus className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {t({ en: 'Footer', de: 'Fußzeile' })}
        </button>
        {expandedSections.footer && (
          <div className="space-y-4 pl-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t({ en: 'Copyright (EN)', de: 'Copyright (DE)' })}
              </label>
              <Textarea
                value={data.footer.copyright.en}
                onChange={(e) => handleMultiLangChange(['footer', 'copyright'], 'en', e.target.value)}
                rows={2}
                className="mb-2"
              />
              <Textarea
                value={data.footer.copyright.de}
                onChange={(e) => handleMultiLangChange(['footer', 'copyright'], 'de', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVEditor;
