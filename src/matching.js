const normalize = value => String(value || '').trim().toLowerCase();
const terms = value => String(value || '').split(',').map(normalize).filter(Boolean);

export function portfolioEvidence(creator, brief = {}) {
  const requested = [normalize(brief.contentType), ...terms(brief.skills), ...terms(brief.tools)].filter(Boolean);
  const projects = creator.projects || [];
  if (!projects.length) return null;
  const ranked = projects.map(project => {
    const evidence = [project.title, project.description, ...(project.caseStudy?.portfolioFocus || [])].map(normalize).join(' ');
    const matched = requested.filter(term => evidence.includes(term));
    return { project, matched };
  }).sort((a, b) => b.matched.length - a.matched.length);
  const best = ranked[0];
  const creatorMatches = requested.filter(term => [...creator.skills, ...creator.tools, ...creator.content].some(item => normalize(item).includes(term) || term.includes(normalize(item))));
  return {
    project: best.project,
    matched: best.matched,
    detail: best.matched.length
      ? `Its listed focus overlaps with ${best.matched.join(', ')}.`
      : creatorMatches.length
        ? `This portfolio sample sits alongside the creator's listed ${creatorMatches.join(', ')} capability.`
        : `A representative demo sample from ${creator.name}'s declared ${creator.specialty} portfolio.`,
  };
}

export function match(creator, brief = {}) {
  const requiredSkills = (brief.skills || '').split(',').map(normalize).filter(Boolean);
  const requiredTools = (brief.tools || '').split(',').map(normalize).filter(Boolean);
  const skillHits = requiredSkills.filter(required => creator.skills.some(skill => normalize(skill).includes(required) || required.includes(normalize(skill))));
  const toolHits = requiredTools.filter(required => creator.tools.some(tool => normalize(tool).includes(required) || required.includes(normalize(tool))));
  const checks = [];
  let earnedTotal = 0;
  let assessedWeight = 0;

  const add = (label, weight, applicable, ratio, detail, matched = [], missing = []) => {
    const earned = applicable ? Math.round(weight * Math.max(0, Math.min(1, ratio))) : null;
    if (applicable) {
      earnedTotal += earned;
      assessedWeight += weight;
    }
    const status = !applicable ? 'not_requested' : earned === weight ? 'matched' : earned > 0 ? 'partial' : 'mismatch';
    checks.push({ label, weight, earned, applicable, status, detail, matched, missing });
  };

  const contentType = normalize(brief.contentType);
  const specializationMatch = !contentType || creator.content.some(item => normalize(item) === contentType) || normalize(creator.specialty).includes(contentType);
  add('Specialization', 25, Boolean(contentType), specializationMatch ? 1 : 0,
    specializationMatch ? `Listed in ${creator.specialty}; content includes ${creator.content.join(', ')}.` : `No direct match for ${brief.contentType}; creator specializes in ${creator.specialty}.`,
    specializationMatch && contentType ? [brief.contentType] : [], specializationMatch || !contentType ? [] : [brief.contentType]);
  add('Skills', 25, requiredSkills.length > 0, requiredSkills.length ? skillHits.length / requiredSkills.length : 0,
    requiredSkills.length ? `${skillHits.length}/${requiredSkills.length} requested skills overlap${skillHits.length ? `: ${skillHits.join(', ')}` : '.'}` : 'No required skills were specified.',
    skillHits, requiredSkills.filter(required => !skillHits.includes(required)));
  add('Tools', 15, requiredTools.length > 0, requiredTools.length ? toolHits.length / requiredTools.length : 0,
    requiredTools.length ? `${toolHits.length}/${requiredTools.length} required tools are listed${toolHits.length ? `: ${toolHits.join(', ')}` : '.'}` : 'No required tools were specified.',
    toolHits, requiredTools.filter(required => !toolHits.includes(required)));

  const formatMatch = !brief.format || creator.formats.includes(brief.format);
  add('Output format', 8, Boolean(brief.format), formatMatch ? 1 : 0,
    formatMatch ? `Creator lists ${brief.format || 'supported formats'}${brief.format ? '.' : `: ${creator.formats.join(', ')}.`}` : `${brief.format} is not listed; supported formats are ${creator.formats.join(', ')}.`,
    formatMatch && brief.format ? [brief.format] : [], formatMatch || !brief.format ? [] : [brief.format]);
  const ratioMatch = !brief.ratio || creator.ratios.includes(brief.ratio);
  add('Aspect ratio', 7, Boolean(brief.ratio), ratioMatch ? 1 : 0,
    ratioMatch ? `Creator lists ${brief.ratio || 'supported aspect ratios'}${brief.ratio ? '.' : `: ${creator.ratios.join(', ')}.`}` : `${brief.ratio} is not listed; supported ratios are ${creator.ratios.join(', ')}.`,
    ratioMatch && brief.ratio ? [brief.ratio] : [], ratioMatch || !brief.ratio ? [] : [brief.ratio]);

  const commercialRequired = /paid|commercial|license|exclusive/i.test(brief.license || '');
  add('Commercial use', 20, commercialRequired, creator.commercial ? 1 : 0,
    commercialRequired ? (creator.commercial ? creator.disclosure : 'Commercial-use terms are not listed.') : 'No commercial-use requirement was specified.',
    commercialRequired && creator.commercial ? ['Terms disclosed'] : [], commercialRequired && !creator.commercial ? ['Commercial-use terms'] : []);

  return {
    score: assessedWeight ? Math.round(earnedTotal / assessedWeight * 100) : null,
    earned: earnedTotal,
    possible: assessedWeight,
    assessed: checks.filter(check => check.applicable).length,
    checks,
  };
}

export function filterCreators(creators, { query = '', spec = '', tool = '', content = '', sort = 'best', brief = {} } = {}) {
  const needle = normalize(query);
  const results = creators.filter(creator => {
    const searchable = [creator.name, creator.specialty, creator.bio, ...creator.skills, ...creator.tools, ...creator.content].join(' ').toLowerCase();
    return (!needle || searchable.includes(needle))
      && (!spec || creator.specialty === spec)
      && (!tool || creator.tools.includes(tool))
      && (!content || creator.content.includes(content));
  });
  if (sort === 'best' && brief.title) results.sort((a, b) => (match(b, brief).score ?? 0) - (match(a, brief).score ?? 0));
  if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}
