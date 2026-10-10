export function match(creator, brief = {}) {
  const requiredSkills = (brief.skills || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  const requiredTools = (brief.tools || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  const skillHits = requiredSkills.filter(required => creator.skills.some(skill => skill.toLowerCase().includes(required) || required.includes(skill.toLowerCase())));
  const toolHits = requiredTools.filter(required => creator.tools.some(tool => tool.toLowerCase().includes(required) || required.includes(tool.toLowerCase())));
  let score = 0;
  const checks = [];
  const add = (label, weight, ratio, detail) => {
    const earned = Math.round(weight * Math.max(0, Math.min(1, ratio)));
    score += earned;
    checks.push({ label, weight, earned, ok: earned === weight, detail });
  };

  const specializationMatch = !brief.contentType || creator.content.some(item => item.toLowerCase() === brief.contentType.toLowerCase()) || creator.specialty.toLowerCase().includes(brief.contentType.toLowerCase());
  add('Specialization', 25, specializationMatch ? 1 : 0, specializationMatch
    ? `Listed in ${creator.specialty}; content includes ${creator.content.join(', ')}.`
    : `No direct match for ${brief.contentType}; creator specializes in ${creator.specialty}.`);
  add('Skills', 25, requiredSkills.length ? skillHits.length / requiredSkills.length : 1, requiredSkills.length
    ? `${skillHits.length}/${requiredSkills.length} requested skills overlap: ${skillHits.length ? skillHits.join(', ') : 'none'}.`
    : 'No required skills; this category is not a constraint.');
  add('Tools', 15, requiredTools.length ? toolHits.length / requiredTools.length : 1, requiredTools.length
    ? `${toolHits.length}/${requiredTools.length} required tools listed: ${toolHits.length ? toolHits.join(', ') : 'none'}.`
    : 'No required tools; this category is not a constraint.');

  const formatMatch = !brief.format || creator.formats.includes(brief.format);
  const ratioMatch = !brief.ratio || creator.ratios.includes(brief.ratio);
  add('Output format', 8, formatMatch ? 1 : 0, formatMatch
    ? `Lists support for ${brief.format || creator.formats.join(', ')}.`
    : `${brief.format} is not in the creator’s listed formats (${creator.formats.join(', ')}).`);
  add('Aspect ratio', 7, ratioMatch ? 1 : 0, ratioMatch
    ? `Lists support for ${brief.ratio || creator.ratios.join(', ')}.`
    : `${brief.ratio} is not listed (${creator.ratios.join(', ')}).`);

  const commercialRequired = /paid|commercial|license|exclusive/i.test(brief.license || '');
  add('Commercial use', 20, !commercialRequired || creator.commercial ? 1 : 0, !commercialRequired
    ? 'No specific commercial-use requirement selected.'
    : creator.commercial ? creator.disclosure : 'Commercial-use terms are not listed.');
  return { score, checks };
}

export function filterCreators(creators, { query = '', spec = '', tool = '', content = '', sort = 'best', brief = {} } = {}) {
  const needle = query.trim().toLowerCase();
  const results = creators.filter(creator => {
    const searchable = [creator.name, creator.specialty, creator.bio, ...creator.skills, ...creator.tools, ...creator.content].join(' ').toLowerCase();
    return (!needle || searchable.includes(needle))
      && (!spec || creator.specialty === spec)
      && (!tool || creator.tools.includes(tool))
      && (!content || creator.content.includes(content));
  });
  if (sort === 'best' && brief.title) results.sort((a, b) => match(b, brief).score - match(a, brief).score);
  if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}
